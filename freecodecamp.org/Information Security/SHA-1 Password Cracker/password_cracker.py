import hashlib
from pathlib import Path


def crack_sha1_hash(hash, use_salts=False):

  def read_file_lines(file_path):
    with open(file_path, "r") as file:
      return [line.strip() for line in file.readlines()]

  current_dir = Path(__file__).parent
  passwords = read_file_lines(current_dir / "top-10000-passwords.txt")
  known_salts = read_file_lines(current_dir / "known-salts.txt")

  def compare_hash(hashed_password, password):
    h = hashlib.sha1(password.encode()).hexdigest()
    return h == hashed_password

  for password in passwords:
    if use_salts:
      for salt in known_salts:
        if compare_hash(hash, salt + password) or compare_hash(
            hash, password + salt):
          return password
    else:
      if compare_hash(hash, password):
        return password

  return "PASSWORD NOT IN DATABASE"
