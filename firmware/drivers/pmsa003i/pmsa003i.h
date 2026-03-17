#ifndef PMSA003I_H
#define PMSA003I_H

#include <stdint.h>
#include <zephyr/drivers/i2c.h>

#define SENSOR_START_CHAR 0x00
#define PM_1_0_HIGH_REG 0x0a
#define PM_1_0_LOW_REG 0x0b
#define PM_2_5_HIGH_REG 0x0c
#define PM_2_5_LOW_REG 0x0d
#define PM_10_0_HIGH_REG 0x0e
#define PM_10_0_LOW_REG 0x0f

#define DATA_CHECK_HIGH 0x1e
#define DATA_CHECK_LOW 0x1f
#define CHECKSUM_SIZE 30

#define WRITE_BUFFER_SIZE 1
#define READ_BUFFER_SIZE 32

typedef struct
{
    struct i2c_dt_spec i2c;
} pmsa003i_config_t;

typedef struct
{
    uint16_t pm1_0;  // PM1.0 concentration (µg/m³)
    uint16_t pm2_5;  // PM2.5 concentration (µg/m³)
    uint16_t pm10_0; // PM10.0 concentration (µg/m³)
} pmsa003i_data_t;

int pmsa003i_init(const pmsa003i_config_t *config);
int pmsa003i_read(const pmsa003i_config_t *config, pmsa003i_data_t *data);

#endif // PMSA003I_H