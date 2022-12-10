from microdot_asyncio import Microdot, Response, send_file
from microdot_utemplate import render_template
from ds18b20_module import DS18b20Module
import ujson

DS_PIN = 21

# Our DS18B20 Module
ds_sensor = DS18b20Module(DS_PIN)

app = Microdot()
Response.default_content_type = 'text/html'


@app.route('/')
async def index(request):
    return render_template('index.html')


@app.route('/updateValues')
async def get_ds18b20_reads(request):
    print("Receive get values request!")
    sensor_reads = ds_sensor.get_temp_reading()
    return ujson.dumps({"reading" : sensor_reads})


@app.route('/shutdown')
async def shutdown(request):
    request.app.shutdown()
    return 'The server is shutting down...'


@app.route('/static/<path:path>')
def static(request, path):
    if '..' in path:
        # directory traversal is not allowed
        return 'Not found', 404
    return send_file('static/' + path)

app.run()