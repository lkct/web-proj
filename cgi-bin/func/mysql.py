import MySQLdb
import string
import os


def mysql(sql, cursor):
    if type(sql) != list:
        sql = [sql]
    for ln in sql:
        cursor.execute(ln)
    ret = []

    if sql[0][0:6] == "SELECT":
        result = cursor.fetchall()
        table = sql[0].split(' ')[3]
        cursor.execute('DESCRIBE %s' % (table))
        fields = cursor.fetchall()
        fields = [ln[0] for ln in fields]
        ret = [dict(zip(fields, ln)) for ln in result]

    return ret


def rm_r(cursor, path, fn):
    cursor.execute('DESCRIBE %s' % ('file_list'))
    fields = cursor.fetchall()
    fields = [ln[0] for ln in fields]

    sql = 'SELECT * FROM file_list WHERE path="%s" AND filename="%s"' % (
        path, fn)
    cursor.execute(sql)
    result = cursor.fetchall()
    result = [dict(zip(fields, ln)) for ln in result]
    sql = 'DELETE FROM file_list WHERE path="%s" AND filename="%s"' % (
        path, fn)
    cursor.execute(sql)
    if result[0]['is_dir'] == 1:
        path_ = os.path.join(path, fn)
        sql = 'SELECT * FROM file_list WHERE path="%s"' % (path_)
        cursor.execute(sql)
        result = cursor.fetchall()
        result = [dict(zip(fields, ln)) for ln in result]
        for ln in result:
            rm_r(cursor, ln['path'], ln['filename'])
    else:
        sql = 'UPDATE md5_list SET ref_cnt=ref_cnt-1 WHERE md5="%s"' % (
            result[0]['md5'])
        cursor.execute(sql)


def cp_r(cursor, path, fn, path2, fn2):
    cursor.execute('DESCRIBE %s' % ('file_list'))
    fields = cursor.fetchall()
    fields = [ln[0] for ln in fields]

    sql = 'SELECT * FROM file_list WHERE path="%s" AND filename="%s"' % (
        path, fn)
    cursor.execute(sql)
    result = cursor.fetchall()
    result = [dict(zip(fields, ln)) for ln in result]
    sql = 'INSERT INTO file_list (path, filename, is_dir, md5, size) ' \
        'VALUES ("%s", "%s", %d, "%s", %d)' % (
            path2, fn2, result[0]['is_dir'], result[0]['md5'], result[0]['size'])
    cursor.execute(sql)
    if result[0]['is_dir'] == 1:
        path_ = os.path.join(path, fn)
        path2_ = os.path.join(path2, fn2)
        sql = 'SELECT * FROM file_list WHERE path="%s"' % (path_)
        cursor.execute(sql)
        result = cursor.fetchall()
        result = [dict(zip(fields, ln)) for ln in result]
        for ln in result:
            cp_r(cursor, path_, ln['filename'], path2_, ln['filename'])
    else:
        sql = 'UPDATE md5_list SET ref_cnt=ref_cnt+1 WHERE md5="%s"' % (
            result[0]['md5'])
        cursor.execute(sql)
