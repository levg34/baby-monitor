#!/bin/bash

cd ~/prod/baby-monitor
git fetch -p
git reset --hard origin/main
sudo systemctl restart baby-monitor