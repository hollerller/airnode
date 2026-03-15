
#include <zephyr/bluetooth/gatt.h>
#include <string.h>
#include <zephyr/logging/log.h>

#include "sensor_service.h"

LOG_MODULE_REGISTER(sensor_service, LOG_LEVEL_DBG);

static char hello[] = "hello";

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

BT_GATT_SERVICE_DEFINE(airnode_service,
                       BT_GATT_PRIMARY_SERVICE(BT_UUID_SENSOR),

                       BT_GATT_CHARACTERISTIC(BT_UUID_SENSOR_DATA,
                                              BT_GATT_CHRC_READ,
                                              BT_GATT_PERM_READ, read_sensor_data, NULL,
                                              &hello), );
