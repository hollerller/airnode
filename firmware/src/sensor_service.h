#ifndef SENSOR_SERVICE_H
#define SENSOR_SERVICE_H

#include <zephyr/bluetooth/uuid.h>

struct airnode_readings
{
    int32_t temperature_c;
    int32_t humidity_pct;
    int32_t pressure_hpa;
    uint16_t pm1_0_ugm3;
    uint16_t pm2_5_ugm3;
    uint16_t pm10_ugm3;
};

typedef enum
{
    TEMPERATURE,
    HUMIDITY,
    PRESSURE,
    PM1_0,
    PM2_5,
    PM10
} SensorDataType;

typedef void (*reading_interval_cb_t)(const uint32_t reading_interval_ms);

struct sensor_settings_cb
{
    reading_interval_cb_t reading_interval_cb;
};

/** Value Characteristic UUID - d87f823c-4c33-4ddd-9ac4-4ada6ad5e913 */
#define BT_UUID_SENSOR_SETTINGS_VAL \
    BT_UUID_128_ENCODE(0xd87f823c, 0x4c33, 0x4ddd, 0x9ac4, 0x4ada6ad5e913)

/** Convert the array to a generic UUID */

#define BT_UUID_SENSOR_SETTINGS BT_UUID_DECLARE_128(BT_UUID_SENSOR_SETTINGS_VAL)

int send_sensor_notify(struct airnode_readings sensor_value, SensorDataType type);
int settings_callback_init(struct sensor_settings_cb *callbacks);

#endif // SENSOR_SERVICE_H