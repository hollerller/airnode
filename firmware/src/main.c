#include <zephyr/kernel.h>
#include <zephyr/sys/printk.h>
#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include <zephyr/drivers/gpio.h>

LOG_MODULE_REGISTER(app, LOG_LEVEL_INF);

#define LED0_NODE DT_ALIAS(led0)
#define SLEEP_TIME_S 5
#define WAKE_INTERVAL_MS 10000

static const struct gpio_dt_spec led = GPIO_DT_SPEC_GET(LED0_NODE, gpios);

int main(void)

{
        int ret;

        printk("Low power testing and current measurement");

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
                LOG_INF("Wake up - uptime %u ms", uptime);
                gpio_pin_toggle_dt(&led);
                k_sleep(K_MSEC(WAKE_INTERVAL_MS));
        }
}
