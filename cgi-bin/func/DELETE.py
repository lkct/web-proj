import cgi
import os
import sys
import json
import requests

from mysql import mysql


def delete():
    db = MySQLdb.connect('localhost', 'web', 'web', 'web', charset='utf8')
    cursor = db.cursor()

    sql = 'SELECT * FROM md5_list WHERE ref_cnt=0'
    result = mysql(sql, cursor)
    md5list = [ln['md5'] for ln in result]

    payload = {'md5list': json.dumps(md5list)}
    url = 'http://' + file_srv + '/cgi-bin/delete.py'
    r = requests.post(url, data=payload)
    r.raise_for_status()

    sql = 'DELETE FROM md5_list WHERE ref_cnt=0'
    mysql(sql, cursor)

    db.commit()
    db.close()

    return