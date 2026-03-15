
#include <zephyr/bluetooth/gatt.h>
#include <string.h>
#include <zephyr/logging/log.h>

#include "sensor_service.h"

LOG_MODULE_REGISTER(sensor_service, LOG_LEVEL_DBG);

static char hello[] = "hello";
static bool notify_sensor_enabled;

static ssize_t read_sensor_data(struct bt_conn *conn,
                                const struct bt_gatt_attr *attr,
                                void *buf,
                                uint16_t len,
                                uint16_t offset)
{
    // get a pointer to value which is passed in the BT_GATT_CHARACTERISTIC() and stored in attr->user_data
    const char *value = attr->user_data;

    LOG_DBG("Attribute read, handle: %u, conn: %p", attr->handle,
            (void *)conn);

    return bt_gatt_attr_read(conn, attr, buf, len, offset, value,
                             strlen(value));
}

static void airnode_ccc_sendor_cfg_changed(const struct bt_gatt_attr *attr,
                                           uint16_t value)
{
    notify_sensor_enabled = (value == BT_GATT_CCC_NOTIFY);
}

BT_GATT_SERVICE_DEFINE(airnode_service,
                       BT_GATT_PRIMARY_SERVICE(BT_UUID_SENSOR),

                       BT_GATT_CHARACTERISTIC(BT_UUID_SENSOR_DATA,
                                              BT_GATT_CHRC_READ | BT_GATT_CHRC_NOTIFY,
                                              BT_GATT_PERM_READ, read_sensor_data, NULL,
                                              &hello),

                       BT_GATT_CCC(airnode_ccc_sendor_cfg_changed,
                                   BT_GATT_PERM_READ | BT_GATT_PERM_WRITE), );

int mock_send_sensor_notify(uint32_t sensor_value)
{
    if (!notify_sensor_enabled)
    {
        return -EACCES;
    }

    return bt_gatt_notify(NULL, &airnode_service.attrs[2],
                          &sensor_value,
                          sizeof(sensor_value));
}
