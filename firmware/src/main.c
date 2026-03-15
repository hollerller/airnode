#include <zephyr/logging/log.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/drivers/sensor.h>
#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/bluetooth/gap.h>

#include "sensor_service.h"

#define LED0_NODE DT_ALIAS(led0)
#define WAKE_INTERVAL_MS 10000
#define I2C_NODE DT_NODELABEL(bme680)
#define DEVICE_NAME CONFIG_BT_DEVICE_NAME
#define DEVICE_NAME_LEN (sizeof(DEVICE_NAME) - 1)

LOG_MODULE_REGISTER(airnode, LOG_LEVEL_DBG);

static const struct gpio_dt_spec led = GPIO_DT_SPEC_GET(LED0_NODE, gpios);
const struct device *const dev_i2c = DEVICE_DT_GET(I2C_NODE);
struct sensor_value temp;
struct sensor_value hum;
struct sensor_value press;

static const struct bt_data ad[] = {
    BT_DATA_BYTES(BT_DATA_FLAGS, BT_LE_AD_GENERAL),

    BT_DATA(BT_DATA_NAME_COMPLETE, DEVICE_NAME, DEVICE_NAME_LEN),
};

int main(void)
{
        LOG_INF("BME680 sensor reading");
        int ret;

        ret = bt_enable(NULL);
        if (ret)
        {
                LOG_ERR("Bluetooth init failed (err %d)\n", ret);
        }
        LOG_INF("Bluetooth initialized\n");

        ret = bt_le_adv_start(BT_LE_ADV_CONN_FAST_1, ad, ARRAY_SIZE(ad), 0, 0);
        if (ret)
        {
                LOG_ERR("Advertising failed to start (err %d)\n", ret);
                return -1;
        }

        if (!device_is_ready(dev_i2c))
        {
                LOG_ERR("I2C bus %s is not ready!", dev_i2c->name);
                return -1;
        }

        if (!gpio_is_ready_dt(&led))
        {
                return 0;
        }

        ret = gpio_pin_configure_dt(&led, GPIO_OUTPUT_ACTIVE);
        if (ret < 0)
        {
                return 0;
        }

        while (1)
        {
                uint32_t uptime = k_uptime_get_32();
                LOG_DBG("Wake up - uptime %u ms", uptime);
                ret = sensor_sample_fetch(dev_i2c);

                if (ret < 0)
                {
                        LOG_ERR("Error fetching data");
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

                temperature_send_sensor_notify(temp.val1);

                gpio_pin_toggle_dt(&led);
                k_sleep(K_MSEC(WAKE_INTERVAL_MS));
        }
}
