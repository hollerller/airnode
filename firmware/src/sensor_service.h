#ifndef SENSOR_SERVICE_H
#define SENSOR_SERVICE_H

#include <zephyr/bluetooth/uuid.h>

/** Initial Service UUID - 4cff14aa-fca7-4da8-89d7-952ac08b3085 */
#define BT_UUID_SENSOR_SERVICE_VAL \
    BT_UUID_128_ENCODE(0x4cff14aa, 0xfca7, 0x4da8, 0x89d7, 0x952ac08b3085)

/** Value Characteristic UUID - 8123e770-73b5-4b07-aa24-99f776d1e37a */
#define BT_UUID_SENSOR_DATA_VAL \
    BT_UUID_128_ENCODE(0x8123e770, 0x73b5, 0x4b07, 0xaa24, 0x99f776d1e37a)

/** Convert the array to a generic UUID */

#define BT_UUID_SENSOR BT_UUID_DECLARE_128(BT_UUID_SENSOR_SERVICE_VAL)
#define BT_UUID_SENSOR_DATA BT_UUID_DECLARE_128(BT_UUID_SENSOR_DATA_VAL)

int temperature_send_sensor_notify(int32_t sensor_value);

#endif // SENSOR_SERVICE_H