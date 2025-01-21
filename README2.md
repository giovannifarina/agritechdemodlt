docker build -t agridevcontainer .

docker run --network=host -v ./../agritechdemodlt/:/root/agritechdemodlt -it -d --name agridev  agridevcontainer