import cgi
import os
import sys
import json
import requests
import MySQLdb

from mysql import mysql


def delete(srv_id):
    db = MySQLdb.connect('localhost', 'web', 'web', 'web', charset='utf8')
    cursor = db.cursor()

    sql = 'SELECT * FROM md5_list WHERE ref_cnt=0 AND srv_id=%d' % (srv_id)
    result = mysql(sql, cursor)
    md5list = [ln['md5'] for ln in result]
    size = sum([ln['size'] for ln in result])

    sql = 'SELECT * FROM file_server WHERE srv_id=%d' % (srv_id)
    result = mysql(sql, cursor)
    file_srv = result[0]['file_srv']

    payload = {'md5list': json.dumps(md5list)}
    url = 'http://' + file_srv + '/cgi-bin/delete.py'
    r = requests.post(url, data=payload)
    r.raise_for_status()

    sql = [
        'DELETE FROM md5_list WHERE ref_cnt=0 AND srv_id=%d' % (srv_id),
        'UPDATE file_server SET avail_space=avail_space+%d WHERE srv_id="%s"' % (
            size, srv_id)
    ]
    mysql(sql, cursor)

    db.commit()
    db.close()

    return
