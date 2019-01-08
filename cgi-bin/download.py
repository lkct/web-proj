#!/usr/bin/python
# -*- coding: UTF-8 -*-

import cgi
import cgitb
import os
import sys
import traceback
import json
import requests
import datetime

import func

log_file = '/var/www/html/grp-srv/tmp/err.log'

# cgitb.enable()
form = cgi.FieldStorage()

try:
    dl_token = form.getvalue('dl_token')

    dl_msg = func.token.check(dl_token)['dl_msg']
    dl_msg = json.loads(func.rsa.decrypt(dl_msg))

    url = 'http://' + dl_msg['file_srv'] + '/files/' + dl_msg['md5']

    headers = {}
    for key in os.environ.keys():
        if key[0:5] == 'HTTP_':
            if key[5:] == 'HOST':
                headers[key[5:]] = dl_msg['file_srv']
            else:
                headers[key[5:]] = os.environ[key]
    
    chunk_size = 1000000
    r = requests.request(os.environ['REQUEST_METHOD'], url, headers=headers, stream=True)
    print 'Status: %d' % r.status_code
    print 'Content-Disposition: attachment; filename="%s"' % (dl_msg['filename'])
    for key in r.headers.keys():
        print '%s: %s' % (key, r.headers[key])
    print ''
    while True:
        cont = r.raw.read(chunk_size)
        if cont == '':
            break
        sys.stdout.write(cont)
    print ''
except Exception, e:
    msg = {'errno': -1, 'errmsg': 'Error occured, check server log for details'}
    print 'Status: 400 Bad Request'
    print 'Content-Type: text/html'
    print ''
    print json.dumps(msg)

    with open(log_file, 'w', 664) as f:
        f.write(str(datetime.datetime.now()))
        f.write('\n')
        f.write(traceback.format_exc())
        f.write('\n')
        f.write(str(form))
