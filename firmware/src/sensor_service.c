
#include <zephyr/bluetooth/gatt.h>
#include <zephyr/logging/log.h>

#include "sensor_service.h"

LOG_MODULE_REGISTER(sensor_service, LOG_LEVEL_DBG);

#define MIN_SAMPLING_INTERVAL_MS (1U * 60U * 1000U)
#define MAX_SAMPLING_INTERVAL_MS (30U * 60U * 1000U)

static bool notify_sensor_enabled;
static struct sensor_settings_cb settings_cb;

static void airnode_ccc_sensor_cfg_changed(const struct bt_gatt_attr *attr,
                                           uint16_t value)
{
    notify_sensor_enabled = (value == BT_GATT_CCC_NOTIFY);
}

static ssize_t write_ble_reading_interval(struct bt_conn *conn, const struct bt_gatt_attr *attr, const void *buf,
                                          uint16_t len, uint16_t offset, uint8_t flags)
{
    LOG_DBG("Attribute write, handle: %u, conn: %p", attr->handle, (void *)conn);

    if (len != sizeof(uint32_t))
    {
        LOG_DBG("Sampling Interval: Incorrect data length");
        return BT_GATT_ERR(BT_ATT_ERR_INVALID_ATTRIBUTE_LEN);
    }

    if (offset != 0)
    {
        LOG_DBG("Sampling Interval: Incorrect data offset");
        return BT_GATT_ERR(BT_ATT_ERR_INVALID_OFFSET);
    }

    if (settings_cb.reading_interval_cb)
    {
        // Read the received value
        uint32_t interval_ms = *((uint32_t *)buf);

        if (interval_ms < MIN_SAMPLING_INTERVAL_MS || interval_ms > MAX_SAMPLING_INTERVAL_MS)
        {
            LOG_DBG("Sampling Interval: Value out of bounds");
            return BT_GATT_ERR(BT_ATT_ERR_VALUE_NOT_ALLOWED);
        }

        // Call the application callback function to update the reading interval
        settings_cb.reading_interval_cb(interval_ms);
    }
    else
    {
        LOG_DBG("Sampling Interval: Incorrect value");
        return BT_GATT_ERR(BT_ATT_ERR_VALUE_NOT_ALLOWED);
    }
    return len;
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
                                   BT_GATT_PERM_READ | BT_GATT_PERM_WRITE),

                       BT_GATT_CHARACTERISTIC(BT_UUID_SENSOR_SETTINGS, BT_GATT_CHRC_WRITE, BT_GATT_PERM_WRITE, NULL, write_ble_reading_interval, NULL),

);

int settings_callback_init(struct sensor_settings_cb *callbacks)
{
    if (callbacks)
    {
        settings_cb.reading_interval_cb = callbacks->reading_interval_cb;
    }

    return 0;
}

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
