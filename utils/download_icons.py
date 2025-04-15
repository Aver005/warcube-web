import json
import os
import requests
from bs4 import BeautifulSoup
from typing import Dict, Any

# Цвета для редкостей
RARITY_COLORS = {
    'common': '#A0A0A0',
    'uncommon': '#27AE60',
    'rare': '#3498DB',
    'epic': '#9B59B6',
    'legendary': '#F39C12'
}

# Цвета для типов предметов
TYPE_COLORS = {
    'ranged_weapon': '#E74C3C',
    'melee_weapon': '#C0392B',
    'active': '#2ECC71',
    'consumable': '#3498DB',
    'throwable': '#E67E22',
    'deployable': '#F1C40F',
    'passive': '#1ABC9C',
    'special': '#E91E63'
}

def download_and_color_icons(items_data: Dict[str, Any], output_dir: str = 'icons'):
    """Скачивает и раскрашивает иконки"""
    
    os.makedirs(output_dir, exist_ok=True)
    
    for _, item in items_data.items():
        try:
            icon_parts = item['icon'].split(':')
            if len(icon_parts) != 2:
                print(f"Неправильный формат иконки: {item['icon']}")
                continue
                
            icon_prefix, icon_name = icon_parts
            url = f"https://api.iconify.design/{icon_prefix}/{icon_name}.svg"
            
            response = requests.get(url)
            if response.status_code != 200:
                print(f"Не удалось скачать иконку: {item['icon']}")
                continue
                
            soup = BeautifulSoup(response.text, 'html.parser')
            svg = soup.find('svg')
            
            if not svg:
                print(f"Не удалось распарсить SVG для иконки: {item['icon']}")
                continue
            
            # Удаляем встроенные стили, которые могут мешать
            if svg.get('style'):
                del svg['style']
            
            # Устанавливаем цвета
            fill_color = TYPE_COLORS.get(item['type'], '#000000')
            stroke_color = RARITY_COLORS.get(item['rarity'], '#000000')
            
            if 'em' in svg['width']:
                svg['width'] = svg['width'].replace('em', '')
                svg['height'] = svg['height'].replace('em', '')
                svg['width'] = float(svg['width']) * 16
                svg['height'] = float(svg['height']) * 16
               
            if svg.has_attr('viewBox') or svg.has_attr('viewbox'):
                viewBox = svg['viewBox'] if svg.has_attr('viewBox') else svg['viewbox']
                svg['viewBox'] = viewBox
                size = viewBox.split(' ')[2:]
                svg['width'] = size[0]
                svg['height'] = size[1]
            
            svg['stroke'] = stroke_color
            svg['stroke-width'] = max(float(svg['width']) / 32, 1.5)
            svg['stroke-linecap'] = 'round'
            svg['stroke-linejoin'] = 'round'
            svg['fill'] = fill_color
            
            # Сохраняем
            filename = f"{output_dir}/{item['icon'].replace(':', '_')}.svg"
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(str(svg))
                
            print(f"Сохранено: {filename}")
            
        except Exception as e:
            print(f"Ошибка при обработке {item.get('name', 'unknown')}: {e}")

# Пример использования
if __name__ == "__main__":
    # Загружаем данные из JSON (в вашем случае это будет полный JSON файл)
    items_json = open('items.json', encoding='utf-8').read()
    
    items_data = json.loads(items_json)
    download_and_color_icons(items_data)
