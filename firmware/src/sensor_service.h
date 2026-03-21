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

/** Initial Service UUID - 4cff14aa-fca7-4da8-89d7-952ac08b3085 */
#define BT_UUID_SENSOR_SERVICE_VAL \
    BT_UUID_128_ENCODE(0x4cff14aa, 0xfca7, 0x4da8, 0x89d7, 0x952ac08b3085)

/** Value Characteristic UUID - 8123e770-73b5-4b07-aa24-99f776d1e37a */
#define BT_UUID_SENSOR_DATA_VAL \
    BT_UUID_128_ENCODE(0x8123e770, 0x73b5, 0x4b07, 0xaa24, 0x99f776d1e37a)

/** Convert the array to a generic UUID */

#define BT_UUID_SENSOR BT_UUID_DECLARE_128(BT_UUID_SENSOR_SERVICE_VAL)
#define BT_UUID_SENSOR_DATA BT_UUID_DECLARE_128(BT_UUID_SENSOR_DATA_VAL)

int send_sensor_notify(struct airnode_readings sensor_value, SensorDataType type);

#endif // SENSOR_SERVICE_H