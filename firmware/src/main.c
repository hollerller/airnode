#include <stdio.h>

#include <zephyr/logging/log.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/drivers/sensor.h>
#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/bluetooth/gap.h>

#include "sensor_service.h"
#include "pmsa003i/pmsa003i.h"

#define RETRY_DELAY_MS 10000
#define WARM_UP_INTERVAL_MS 10000
#define WAKE_UP_INTERVAL 300000

#define LED0_NODE DT_ALIAS(led0)
#define I2C_NODE DT_NODELABEL(bme680)
#define I2C_PMSA003I_NODE DT_NODELABEL(pmsa003i)
#define DEVICE_NAME CONFIG_BT_DEVICE_NAME
#define DEVICE_NAME_LEN (sizeof(DEVICE_NAME) - 1)

LOG_MODULE_REGISTER(airnode, LOG_LEVEL_DBG);

static const struct gpio_dt_spec led = GPIO_DT_SPEC_GET(LED0_NODE, gpios);
static const struct device *const dev_i2c = DEVICE_DT_GET(I2C_NODE);
static const pmsa003i_config_t pmsa003i_config = {
    .i2c = I2C_DT_SPEC_GET(I2C_PMSA003I_NODE)};

static struct sensor_value temp;
static struct sensor_value hum;
static struct sensor_value press;
static pmsa003i_data_t pmsa003i_data_raw;

static struct airnode_readings full_reading;

static const struct bt_data ad[] = {
    BT_DATA_BYTES(BT_DATA_FLAGS, BT_LE_AD_GENERAL),

    BT_DATA(BT_DATA_NAME_COMPLETE, DEVICE_NAME, DEVICE_NAME_LEN),
};

int main(void)
{
        int ret;

        if (!device_is_ready(dev_i2c))
        {
                LOG_ERR("I2C bus for BME680 %s is not ready!", dev_i2c->name);
                return -1;
        }

        ret = pmsa003i_init(&pmsa003i_config);
        if (ret)
        {
                return -1;
        }

        if (!gpio_is_ready_dt(&led))
        {
                return -1;
        }

        ret = gpio_pin_configure_dt(&led, GPIO_OUTPUT_ACTIVE);
        if (ret < 0)
        {
                return -1;
        }
        k_sleep(K_MSEC(WARM_UP_INTERVAL_MS));

        while (1)
        {
                uint32_t uptime = k_uptime_get_32();
                LOG_DBG("Wake up - uptime %u ms", uptime);

                ret = bt_enable(NULL);
                if (ret)
                {
                        LOG_ERR("Bluetooth init failed (err %d)\n", ret);
                        return -1;
                }

                LOG_INF("Bluetooth initialized\n");

                ret = bt_le_adv_start(BT_LE_ADV_CONN_FAST_1, ad, ARRAY_SIZE(ad), 0, 0);
                if (ret)
                {
                        LOG_ERR("Advertising failed to start (err %d)\n", ret);
                        return -1;
                }

                ret = sensor_sample_fetch(dev_i2c);

                if (ret < 0)
                {
                        LOG_ERR("Error fetching data");
                        for (int i = 0; i < 5; i++)
                        {
                                ret = sensor_sample_fetch(dev_i2c);
                                k_sleep(K_MSEC(RETRY_DELAY_MS));
                                if (ret == 0)
                                {
                                        break;
                                }
                        }

                        if (ret < 0)
                        {
                                LOG_ERR("Error Detecting sensor");
                                continue;
                        }
                }

                ret = sensor_channel_get(dev_i2c, SENSOR_CHAN_AMBIENT_TEMP, &temp);

                if (ret < 0)
                {
                        LOG_ERR("Error getting temperature data");
                }
                else
                {
                        LOG_DBG("Temperature is %d,%d", temp.val1, temp.val2);
                }

                ret = sensor_channel_get(dev_i2c, SENSOR_CHAN_HUMIDITY, &hum);

                if (ret < 0)
                {
                        LOG_ERR("Error getting humidity data");
                }
                else
                {
                        LOG_DBG("Humidity is %d,%d", hum.val1, hum.val2);
                }

                ret = sensor_channel_get(dev_i2c, SENSOR_CHAN_PRESS, &press);

                if (ret < 0)
                {
                        LOG_ERR("Error getting pressure data");
                }
                else
                {
                        LOG_DBG("Pressure is %d,%d", press.val1, press.val2);
                }

                ret = pmsa003i_read(&pmsa003i_config, &pmsa003i_data_raw);

                if (ret < 0)
                {
                        LOG_ERR("Error fetching pmsa003i data");
                        for (int i = 0; i < 5; i++)
                        {
                                ret = pmsa003i_read(&pmsa003i_config, &pmsa003i_data_raw);
                                k_sleep(K_MSEC(RETRY_DELAY_MS));
                                if (ret == 0)
                                {
                                        break;
                                }
                        }

                        if (ret < 0)
                        {
                                LOG_ERR("Error data");
                                continue;
                        }
                }

                LOG_INF("data raw %d, %d, %d", pmsa003i_data_raw.pm1_0, pmsa003i_data_raw.pm2_5, pmsa003i_data_raw.pm10_0);

                full_reading.temperature_c = temp.val1 * 100 + temp.val2 / 10000;
                full_reading.humidity_pct = hum.val1 * 100 + hum.val2 / 10000;
                full_reading.pressure_hpa = press.val1 * 100 + press.val2 / 10000;
                full_reading.pm1_0_ugm3 = pmsa003i_data_raw.pm1_0;
                full_reading.pm2_5_ugm3 = pmsa003i_data_raw.pm2_5;
                full_reading.pm10_ugm3 = pmsa003i_data_raw.pm10_0;

                send_sensor_notify(full_reading, TEMPERATURE);
                send_sensor_notify(full_reading, HUMIDITY);
                send_sensor_notify(full_reading, PRESSURE);
                send_sensor_notify(full_reading, PM1_0);
                send_sensor_notify(full_reading, PM2_5);
                send_sensor_notify(full_reading, PM10);

                LOG_DBG("Current reading:");
                LOG_DBG("TEMP: %d.%d °C", (int32_t)full_reading.temperature_c / 100, (int32_t)full_reading.temperature_c % 100);
                LOG_DBG("HUM: %d.%d %%", (int32_t)full_reading.humidity_pct / 100, (int32_t)full_reading.humidity_pct % 100);
                LOG_DBG("PRESS: %d.%d hPa", (int32_t)full_reading.pressure_hpa / 100, (int32_t)full_reading.pressure_hpa % 100);
                LOG_DBG("PM1.0: %d μg/m³", full_reading.pm1_0_ugm3);
                LOG_DBG("PM2.5: %d μg/m³", full_reading.pm2_5_ugm3);
                LOG_DBG("PM10: %d μg/m³", full_reading.pm10_ugm3);

                gpio_pin_toggle_dt(&led);
                bt_disable();
                k_sleep(K_MSEC(WAKE_UP_INTERVAL));
        }
}
