## MQTT Model for AirNode

The device will authenticate against MQTT Broker using:

### Username: deviceId

### Password: deviceToken

The format of the topics will have the following format:

### Info sent from device over broker

#### Device status

- airnode/{deviceId}/status

#### Sensor readings

- airnode/{deviceId}/readings

### Info sent from app to broker

#### App commands

- airnode/{deviceId}/cmd
