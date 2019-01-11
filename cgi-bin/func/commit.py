import cgi
import os
import sys
import json
import requests
import urllib

from mysql import mysql

tmp_dir = '/var/www/html/grp-srv/tmp'


def commit(form, params):
    """
    params:
        filename: name of file
        path: directory of file, start with /
        size: file size in bytes
        md5list: list of md5 previously returned, or empty if diff returns 1
        filemd5: md5 of whole file
    return:
        size: copied from params
        md5: copied from params filemd5
    """
    fn = params['filename']
    fpath = params['path']
    size = int(params['size'])
    md5str = params['md5list']
    md5list = json.loads(md5str)
    filemd5 = params['filemd5']

    if len(md5list) > 0:
        sql = 'SELECT * FROM file_server'
        result = mysql(sql)
        servers = {}
        for ln in result:
            servers[ln['srv_id']] = ln['file_srv']
        # TODO: test file servers to decide which
        srv_id = 0
        file_srv = servers[srv_id]
        # TODO: test file servers to decide which

        retlist = []
        for i, md5 in zip(range(len(md5list)), md5list):
            path = os.path.join(tmp_dir, md5)
            param = {'no': i}
            files = {'params': urllib.urlencode(param), 'file': open(path, 'rb')}
            url = 'http://' + file_srv + '/cgi-bin/save_file.py'
            r = requests.post(url, files=files)
            # TODO: bad request handler
            r.raise_for_status()
            # TODO: bad request handler
            retlist.append(r.json()['md5'])
        for md5 in md5list:
            path = os.path.join(tmp_dir, md5)
            if os.path.exists(path):
                os.remove(path)

        payload = {'size': size, 'md5list': json.dumps(retlist), 'filemd5': filemd5}
        url = 'http://' + file_srv + '/cgi-bin/commit.py'
        r = requests.post(url, data=payload)
        # TODO: bad request handler
        r.raise_for_status()
        # TODO: bad request handler

        sql = 'INSERT INTO md5_list (md5, srv_id) VALUES ("%s", %d)' % (filemd5, srv_id)
        mysql(sql)

    sql = [
        'INSERT INTO file_list (path, filename, md5, size) ' \
        'VALUES ("%s", "%s", "%s", %d)' % (fpath, fn, filemd5, size),

        'UPDATE md5_list SET ref_cnt=ref_cnt+1 WHERE md5="%s"' % (filemd5)
    ]
    mysql(sql)

    msg = {'errno': 0, 'size': size, 'md5': filemd5}
    return msg
