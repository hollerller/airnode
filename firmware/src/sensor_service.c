
#include <zephyr/bluetooth/gatt.h>
#include <zephyr/logging/log.h>

#include "sensor_service.h"

LOG_MODULE_REGISTER(sensor_service, LOG_LEVEL_DBG);

static bool notify_sensor_enabled;

static void airnode_ccc_sendor_cfg_changed(const struct bt_gatt_attr *attr,
                                           uint16_t value)
{
    notify_sensor_enabled = (value == BT_GATT_CCC_NOTIFY);
}

BT_GATT_SERVICE_DEFINE(airnode_service,
                       BT_GATT_PRIMARY_SERVICE(BT_UUID_SENSOR),

                       BT_GATT_CHARACTERISTIC(BT_UUID_SENSOR_DATA,
                                              BT_GATT_CHRC_NOTIFY,
                                              BT_GATT_PERM_READ, NULL, NULL,
                                              NULL),

                       BT_GATT_CCC(airnode_ccc_sendor_cfg_changed,
                                   BT_GATT_PERM_READ | BT_GATT_PERM_WRITE), );

int temperature_send_sensor_notify(int32_t sensor_value)
{
    if (!notify_sensor_enabled)
    {
        return -EACCES;
    }

    return bt_gatt_notify(NULL, &airnode_service.attrs[2],
                          &sensor_value,
                          sizeof(sensor_value));
}
