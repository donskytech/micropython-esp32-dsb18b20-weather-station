from machine import Pin, 
import onewire, ds18x20, time


class DS18b20Module:
    def __init__(self, pin_number):
        self.ds_pin = Pin(pin_number)
        self.ds_sensor = ds18x20.DS18X20(onewire.OneWire(self.ds_pin))
    
    def get_temp_reading(self):
        roms = self.ds_sensor.scan()

        if not roms:
            raise RuntimeError("Found no DS18b20")
        
        self.ds_sensor.convert_temp()
        time.sleep_ms(750)
        
        
        temp = self.ds_sensor.read_temp(roms[0])
        print(f"Temperature is {temp}")
        return temp