#!/usr/bin/env python3

import argparse
import hashlib
import os
import qrcode

from typing import List
from qrcode.image.pure import PymagingImage

colors = ['algorand', 'harmony', 'balancer', 'reef', 'vega', 'opolis']
jack_color = 'witnet'


class Badge:
    def __init__(self, index, key):
        self.index = index
        self.key = key


def generate_badge(index: int, salt: str, key_len: int):
    seed = hashlib.sha256()
    seed.update(bytes(f'{salt}|{index}', encoding='utf8'))
    key = seed.digest()[:key_len].hex()

    return Badge(index, key)


def generate_badges(badges_count: int, jacks: int, salt: str, key_len: int):
    return [generate_badge(index, salt, key_len) for index in range(badges_count + jacks)]


def colorize(index: int, first_jack_index: int) -> str:
    if first_jack_index == 0 or index < first_jack_index:
        return colors[index % len(colors)]
    else:
        return jack_color


def generate_qr_code(badge: Badge, base_url: str, output_dir: str, first_jack_index: int):
    url = f'{base_url}{badge.key}'
    output_path = f'{output_dir}/{badge.index}-{badge.key}-{colorize(badge.index, first_jack_index)}.png'

    img = qrcode.make(url, image_factory=PymagingImage, error_correction=qrcode.ERROR_CORRECT_Q, border=0)

    with open(output_path, 'wb') as file:
        img.save(file, 'PNG')


def generate_qr_codes(badges: List[Badge], base_url: str, output_dir: str, first_jack_index: int):
    output_dir_fd = os.path.dirname(output_dir)
    if not os.path.exists(output_dir_fd):
        os.makedirs(output_dir_fd)

    return [generate_qr_code(badge, base_url, output_dir, first_jack_index) for badge in badges]


def main(config):
    badge_count = int(config.badges)
    badges = generate_badges(badge_count, int(config.jacks), config.salt, int(config.key_len))
    [print(f'{badge.index} → {badge.key} ({colorize(badge.index, badge_count)})') for badge in badges]
    generate_qr_codes(badges, config.base_url, config.output_dir, badge_count)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate QR codes for WittyBufficorns at ETHDenver 2022')
    parser.add_argument('--badges', help='how many badges to generate', default=10)
    parser.add_argument('--salt', help='a string to use as salt for deterministic badge key derivation', default='')
    parser.add_argument('--jacks', help='how many jacks / jokers / wildcards to generate', default='0')
    parser.add_argument('--key_len', help='the byte length of badge keys', default=8)
    parser.add_argument('--base_url', help='base URL for QR codes', default='https://bufficorns.com/#/')
    parser.add_argument('--output_dir', help='path for QR image output', default='./qr_codes/')
    args = parser.parse_args()
    main(args)
