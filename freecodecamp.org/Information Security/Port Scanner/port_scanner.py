import socket
import sys
import re
from common_ports import ports_and_services as ps


def get_open_ports(target, port_range, verbose=False):
  open_ports = []
  for port in range(port_range[0], port_range[1] + 1):
    try:
      s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      s.settimeout(1.0)
      result = s.connect_ex((target, port))
      if result == 0:
        open_ports.append(port)
    except KeyboardInterrupt:
      print('\nCtrl+C pressed. Aborting program.')
      sys.exit()
    except socket.gaierror as e:
      if e.errno == -2:
        if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", target):
          return "Error: Invalid IP address"
        else:
          return 'Error: Invalid hostname'
    except socket.error as e:
      pass
    finally:
      s.close()

  if verbose:
    ip = socket.gethostbyname(target)
    if ip == target:
      try:
        url = socket.gethostbyaddr(target)[0]
      except socket.herror as e:
        if e.errno == 1:
          url = ''
    else:
      url = target

    if url == '':
      r = "Open ports for {}\n".format(ip)
    else:
      r = "Open ports for {} ({})\n".format(url, ip)
    r += "PORT     SERVICE\n"
    for i, p in enumerate(open_ports):
      if p in ps:
        service = ps[p]
      else:
        service = 'unknown'
      offset = 9 - len(str(p))
      if i == len(open_ports) - 1:
        r += f"{p}" + " " * offset + f"{service}"
      else:
        r += f"{p}" + " " * offset + f"{service}\n"
    return r

  return open_ports


# Example usage:
if __name__ == "__main__":
  target = "example.com"
  port_range = (1, 1024)
  verbose = True
  result = get_open_ports(target, port_range, verbose)
  print(result)
