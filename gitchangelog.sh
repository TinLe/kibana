#!/bin/bash

echo '<html><header><title>kibana changelog</title></header><body>'
# git log --pretty=format:'<li><a href="https://github.com/elasticsearch/kibana.git/commit/%H">view commit &bull;</a>%s<ul><li>%b</li><li>%N</li></ul></li>' ${1}..${2} 2>&1
git log --pretty=format:' %h %s %b %N' ${1}..${2} 2>&1
#git log --pretty=oneline ${1}..${2} 2>&1
echo '</ul></body></html>'
