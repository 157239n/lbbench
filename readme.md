# Load balancing test suite

This is for load testing progressively bigger and bigger servers, to see how many requests/s can they truly handle.

# Web servers

Full analysis is at https://mlexps.com/other/9-request-throughput/

Everything intended to be run as root

Steps to run:

- Run `initialSetup.sh`
- Go into `bare` and run `./deploy` to deploy the node web servers
- Go into `front` and run `./deploy` to deploy the haproxy load balancer. You can change the [config file](front/haproxy.cfg) to change the number of upstream node servers
- Benchmark the single node process at ports 8000-8015 or the haproxy container

It's not as well-packaged as the code would lead you to believe. You kinda have to understand what the code is doing to use it properly.

# Sql servers

Full analysis is at https://mlexps.com/other/11-sql-throughput/

Steps to run:

- Run `initialSetup.sh` to install Docker
- Go into `mysql` folder and run `./deploy`. This will print out the sql container's ip address.
- Benchmark every endpoint that you want

Read [this](mysql/app/routes/index.js) to know what endpoints are available.
