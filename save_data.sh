#!/bin/bash
date=`date +%Y-%m-%d`
cp ~/prod/baby-monitor/data/datafile ~/prod/backup/${date}-datafile
cp ~/prod/baby-monitor/data/datafile ./data/datafile
cp ~/prod/baby-monitor/data/datafile /mnt/usb/backup/${date}-datafile
