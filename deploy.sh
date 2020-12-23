#!/bin/bash
./save_data.sh
cd ~/prod/baby-monitor
git fetch -p
git reset --hard origin/main
git apply dev/prod.diff
sudo systemctl restart baby-monitor
