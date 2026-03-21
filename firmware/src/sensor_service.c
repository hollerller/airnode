
#include <zephyr/bluetooth/gatt.h>
#include <zephyr/logging/log.h>

#include "sensor_service.h"

LOG_MODULE_REGISTER(sensor_service, LOG_LEVEL_DBG);

static bool notify_sensor_enabled;

static void airnode_ccc_sensor_cfg_changed(const struct bt_gatt_attr *attr,
                                           uint16_t value)
{
    notify_sensor_enabled = (value == BT_GATT_CCC_NOTIFY);
}

BT_GATT_SERVICE_DEFINE(airnode_service,
                       BT_GATT_PRIMARY_SERVICE(BT_UUID_ESS),

                       BT_GATT_CHARACTERISTIC(BT_UUID_TEMPERATURE, BT_GATT_CHRC_NOTIFY, BT_GATT_PERM_READ, NULL, NULL, NULL),

                       BT_GATT_CCC(airnode_ccc_sensor_cfg_changed,
                                   BT_GATT_PERM_READ | BT_GATT_PERM_WRITE),

                       BT_GATT_CHARACTERISTIC(BT_UUID_HUMIDITY, BT_GATT_CHRC_NOTIFY, BT_GATT_PERM_READ, NULL, NULL, NULL),

                       BT_GATT_CCC(airnode_ccc_sensor_cfg_changed,
                                   BT_GATT_PERM_READ | BT_GATT_PERM_WRITE),

                       BT_GATT_CHARACTERISTIC(BT_UUID_PRESSURE, BT_GATT_CHRC_NOTIFY, BT_GATT_PERM_READ, NULL, NULL, NULL),

                       BT_GATT_CCC(airnode_ccc_sensor_cfg_changed,
                                   BT_GATT_PERM_READ | BT_GATT_PERM_WRITE),

                       BT_GATT_CHARACTERISTIC(BT_UUID_GATT_PM1CONC, BT_GATT_CHRC_NOTIFY, BT_GATT_PERM_READ, NULL, NULL, NULL),

                       BT_GATT_CCC(airnode_ccc_sensor_cfg_changed,
                                   BT_GATT_PERM_READ | BT_GATT_PERM_WRITE),

                       BT_GATT_CHARACTERISTIC(BT_UUID_GATT_PM25CONC, BT_GATT_CHRC_NOTIFY, BT_GATT_PERM_READ, NULL, NULL, NULL),

                       BT_GATT_CCC(airnode_ccc_sensor_cfg_changed,
                                   BT_GATT_PERM_READ | BT_GATT_PERM_WRITE),

                       BT_GATT_CHARACTERISTIC(BT_UUID_GATT_PM10CONC, BT_GATT_CHRC_NOTIFY, BT_GATT_PERM_READ, NULL, NULL, NULL),

                       BT_GATT_CCC(airnode_ccc_sensor_cfg_changed,
                                   BT_GATT_PERM_READ | BT_GATT_PERM_WRITE), );

int send_sensor_notify(struct airnode_readings sensor_value, SensorDataType type)
{
    if (!notify_sensor_enabled)
    {
        return -EACCES;
    }

    /** Index 2 is the sensor data notify characteristic.
        Needs to be modified if there are new characteristics added before */

    switch (type)
    {
    case TEMPERATURE:

        return bt_gatt_notify(NULL, &airnode_service.attrs[2],
                              &sensor_value.temperature_c,
                              sizeof(sensor_value.temperature_c));
        break;

    case HUMIDITY:
        return bt_gatt_notify(NULL, &airnode_service.attrs[5],
                              &sensor_value.humidity_pct,
                              sizeof(sensor_value.humidity_pct));
        break;

    case PRESSURE:
        return bt_gatt_notify(NULL, &airnode_service.attrs[8],
                              &sensor_value.pressure_hpa,
                              sizeof(sensor_value.pressure_hpa));
        break;

    case PM1_0:
        return bt_gatt_notify(NULL, &airnode_service.attrs[11],
                              &sensor_value.pm1_0_ugm3,
                              sizeof(sensor_value.pm1_0_ugm3));
        break;

    case PM2_5:
        return bt_gatt_notify(NULL, &airnode_service.attrs[14],
                              &sensor_value.pm2_5_ugm3,
                              sizeof(sensor_value.pm2_5_ugm3));
        break;

    case PM10:
        return bt_gatt_notify(NULL, &airnode_service.attrs[17],
                              &sensor_value.pm10_ugm3,
                              sizeof(sensor_value.pm10_ugm3));
        break;

    default:
        return 0;
        break;
    }
}
