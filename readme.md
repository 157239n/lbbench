# Load balancing test suite

This is for load testing progressively bigger and bigger servers, to see how many requests/s can they truly handle.

Full analysis is at https://mlexps.com/other/9-request-throughput/

Everything intended to be run as root

Steps to run:
- Run `initialSetup.sh`
- Go into `bare` and run `./deploy` to deploy the node web servers
- Go into `front` and run `./deploy` to deploy the haproxy load balancer

It's not as well-packaged as the code would lead you to believe. You kinda have to understand what the code is doing to use it properly.

