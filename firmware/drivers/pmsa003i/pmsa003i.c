#include "pmsa003i.h"
#include <zephyr/device.h>
#include <zephyr/logging/log.h>

LOG_MODULE_REGISTER(pmsa003i, LOG_LEVEL_DBG);

static uint8_t i2c_write_buffer[WRITE_BUFFER_SIZE] = {SENSOR_START_CHAR};
static uint8_t i2c_read_buffer[READ_BUFFER_SIZE];

int pmsa003i_init(const pmsa003i_config_t *config)
{
    if (!device_is_ready(config->i2c.bus))
    {
        LOG_ERR("I2C bus %s is not ready!", config->i2c.bus->name);
        return -1;
    }

    return 0;
}

static uint16_t calculate_checksum(uint8_t *buffer)
{
    uint16_t sum = 0;
    for (int i = 0; i < CHECKSUM_SIZE; i++)
    {
        sum += buffer[i];
    }
    return sum;
}

int pmsa003i_read(const pmsa003i_config_t *config, pmsa003i_data_t *data)
{
    int ret;
    uint16_t checksum = 0;

    ret = i2c_write_read(config->i2c.bus, config->i2c.addr, i2c_write_buffer, sizeof(i2c_write_buffer), i2c_read_buffer, sizeof(i2c_read_buffer));

    if (ret < 0)
    {
        LOG_ERR("Error reading pmsa003i data");
        return -1;
    }

    checksum = calculate_checksum(i2c_read_buffer);

    if ((checksum >> 8) != i2c_read_buffer[DATA_CHECK_HIGH] ||
        (checksum & 0xff) != i2c_read_buffer[DATA_CHECK_LOW])
    {
        LOG_ERR("Data is corrupted");
        return -1;
    }

    data->pm1_0 = i2c_read_buffer[PM_1_0_HIGH_REG] << 8 | i2c_read_buffer[PM_1_0_LOW_REG];
    data->pm2_5 = i2c_read_buffer[PM_2_5_HIGH_REG] << 8 | i2c_read_buffer[PM_2_5_LOW_REG];
    data->pm10_0 = i2c_read_buffer[PM_10_0_HIGH_REG] << 8 | i2c_read_buffer[PM_10_0_LOW_REG];

    return 0;
}
