import asyncio
import websockets
import os
import json
import time

n = 1

async def echo(websocket):
  global n
  async for message in websocket:
    start = time.time()
    with open(f'./infer-test/test-{n}.zip', 'wb') as f:
      f.write(message)
    
    os.system(f'unzip ./infer-test/test-{n}.zip -d ./infer-test/test-{n}')
    os.system(f'echo "unzip time: {(time.time() - start)*1000}" >> ./log/test.txt')
    
    start = time.time()
    infer_option = '--biabduction --bufferoverrun --liveness --pulse --uninit'
    cmd = f'cd ./infer-test/test-{n} && infer run {infer_option} -- make '
    os.system(cmd)
    os.system(f'echo "Infer time: {(time.time() - start)*1000}" >> ./log/test.txt')
    
    start = time.time()
    with open(f'./infer-test/test-{n}/infer-out/report.json', 'r') as f:
      report = json.load(f)
    data = json.loads('{}')
    data['files'] = []
    files = set()
    for bug in report:
      file = bug['file']
      if file not in files:
        files.add(file)
        data['files'].append({
          'filename': file,
          'bugs': [bug]
        })
      else:
        for f in data['files']:
          if f['filename'] == file:
            f['bugs'].append(bug)
    with open(f'./infer-test/test-{n}/infer-out/report-edit.json', 'w') as f:
      json.dump(data, f)
    with open(f'./infer-test/test-{n}/infer-out/report-edit.json', 'rb') as f:
      report = f.read()
    await websocket.send(report)
    os.system(f'echo "report processing time: {(time.time() - start)*1000}" >> ./log/test.txt')
    
    n += 1
    os.system('rm -rf test.zip test')

async def main():
  async with websockets.serve(echo, "localhost", 2020):
    await asyncio.Future()  # run forever

asyncio.run(main())