#include <zephyr/sys/printk.h>
#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/drivers/sensor.h>

LOG_MODULE_REGISTER(app, LOG_LEVEL_INF);

#define LED0_NODE DT_ALIAS(led0)
#define WAKE_INTERVAL_MS 10000
#define I2C_NODE DT_NODELABEL(bme680)

static const struct gpio_dt_spec led = GPIO_DT_SPEC_GET(LED0_NODE, gpios);
const struct device *const dev_i2c = DEVICE_DT_GET(I2C_NODE);
struct sensor_value temp;
struct sensor_value hum;
struct sensor_value press;

int main(void)
{
        printk("BME680 sensor reading\n\r");
        int ret;

        if (!device_is_ready(dev_i2c))
        {
                printk("I2C bus %s is not ready!\n\r", dev_i2c->name);
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
                LOG_INF("Wake up - uptime %u ms\n\r", uptime);
                ret = sensor_sample_fetch(dev_i2c);

                if (ret < 0)
                {
                        printk("Error fetching data\n\r");
                }

                ret = sensor_channel_get(dev_i2c, SENSOR_CHAN_AMBIENT_TEMP, &temp);

                if (ret < 0)
                {
                        printk("Error getting temperature data\n\r");
                }
                else
                {
                        printk("Temperature is %d,%d\n\r", temp.val1, temp.val2);
                }

                ret = sensor_channel_get(dev_i2c, SENSOR_CHAN_HUMIDITY, &hum);

                if (ret < 0)
                {
                        printk("Error getting humidity data\n\r");
                }
                else
                {
                        printk("Humidity is %d,%d\n\r", hum.val1, hum.val2);
                }

                ret = sensor_channel_get(dev_i2c, SENSOR_CHAN_PRESS, &press);

                if (ret < 0)
                {
                        printk("Error getting pressure data\n\r");
                }
                else
                {
                        printk("Pressure is %d,%d\n\r", press.val1, press.val2);
                }

                gpio_pin_toggle_dt(&led);
                k_sleep(K_MSEC(WAKE_INTERVAL_MS));
        }
}
