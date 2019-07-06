//start
graphcool-framework local up
graphcool-framework deploy

//stop
graphcool-framework local stop


// after graphcool-framework local eject

 Could not find cluster local defined for target dev in /home/and/0_dev/demo_graphql/srv-gcool/.graphcoolrc.
 ▸    Please run graphcool local up to start the local cluster.


Written /home/and/0_dev/demo_graphql/srv-gcool/docker-compose.yml
Written /home/and/0_dev/demo_graphql/srv-gcool/.envrc

Success! To run docker on your own, you now can run

  $ direnv allow
    Injects the environment variables
 
  $ docker-compose up
    Starts the local Graphcool instance

.env
docker-compose -p local down