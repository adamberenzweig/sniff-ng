from fabric import api as fab
import boto
 
LOAD_BALANCER_NAME = 'my elb name'
SERVER_USER = 'ec2-user'
SSH_KEY_FILE = '/Users/madadam/work/aws/testkeypair.pem'


def setup_aws():
  # FIXME get from load balancer.
  fab.env.hosts = ['ec2-54-236-246-49.compute-1.amazonaws.com']
  fab.env.key_filename = SSH_KEY_FILE
  fab.env.user = SERVER_USER
  fab.env.parallel = True


def restart_nginx():
  setup_aws()
  fab.run('sudo kill -HUP `cat /var/run/nginx.pid`')


def aws_hosts():
    # This assumes your bash_profile has AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY set.
 
    # Get a list of instance IDs for the ELB.
    instances = []
    conn = boto.connect_elb()
    for elb in conn.get_all_load_balancers(LOAD_BALANCER_NAME):
        instances.extend(elb.instances)
 
    # Get the instance IDs for the reservations.
    conn = boto.connect_ec2()
    reservations = conn.get_all_instances([i.id for i in instances])
    instance_ids = []
    for reservation in reservations:
        for i in reservation.instances:
            instance_ids.append(i.id)
 
    # Get the public CNAMES for those instances.
    hosts = []
    for host in conn.get_all_instances(instance_ids):
        hosts.extend([i.public_dns_name for i in host.instances])
    hosts.sort() # Put them in a consistent order, so that calling code can do hosts[0] and hosts[1] consistently.
 
    return hosts
