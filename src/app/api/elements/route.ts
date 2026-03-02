import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getModels } from '@/lib/models';

// Элементы для автосидинга (все 118 элементов)
const elementsData = [
  { atomicNumber: 1, symbol: "H", nameRu: "Водород", nameEn: "Hydrogen", mass: 1.008, category: "nonmetal", period: 1, group: 1, electronConfiguration: "1s¹", description: "Самый распространенный элемент во Вселенной." },
  { atomicNumber: 2, symbol: "He", nameRu: "Гелий", nameEn: "Helium", mass: 4.003, category: "noble_gas", period: 1, group: 18, electronConfiguration: "1s²", description: "Второй по легкости элемент, не горит." },
  { atomicNumber: 3, symbol: "Li", nameRu: "Литий", nameEn: "Lithium", mass: 6.941, category: "alkali_metal", period: 2, group: 1, electronConfiguration: "[He] 2s¹", description: "Самый легкий металл, используется в батареях." },
  { atomicNumber: 4, symbol: "Be", nameRu: "Бериллий", nameEn: "Beryllium", mass: 9.012, category: "alkaline_earth_metal", period: 2, group: 2, electronConfiguration: "[He] 2s²", description: "Твердый металл, прозрачен для рентгеновских лучей." },
  { atomicNumber: 5, symbol: "B", nameRu: "Бор", nameEn: "Boron", mass: 10.81, category: "metalloid", period: 2, group: 13, electronConfiguration: "[He] 2s² 2p¹", description: "Важен для роста растений." },
  { atomicNumber: 6, symbol: "C", nameRu: "Углерод", nameEn: "Carbon", mass: 12.01, category: "nonmetal", period: 2, group: 14, electronConfiguration: "[He] 2s² 2p²", description: "Основа всей жизни на Земле." },
  { atomicNumber: 7, symbol: "N", nameRu: "Азот", nameEn: "Nitrogen", mass: 14.01, category: "nonmetal", period: 2, group: 15, electronConfiguration: "[He] 2s² 2p³", description: "Составляет 78% атмосферы Земли." },
  { atomicNumber: 8, symbol: "O", nameRu: "Кислород", nameEn: "Oxygen", mass: 16.00, category: "nonmetal", period: 2, group: 16, electronConfiguration: "[He] 2s² 2p⁴", description: "Необходим для дыхания." },
  { atomicNumber: 9, symbol: "F", nameRu: "Фтор", nameEn: "Fluorine", mass: 19.00, category: "halogen", period: 2, group: 17, electronConfiguration: "[He] 2s² 2p⁵", description: "Самый химически активный неметалл." },
  { atomicNumber: 10, symbol: "Ne", nameRu: "Неон", nameEn: "Neon", mass: 20.18, category: "noble_gas", period: 2, group: 18, electronConfiguration: "[He] 2s² 2p⁶", description: "Инертный газ, светится в трубках." },
  { atomicNumber: 11, symbol: "Na", nameRu: "Натрий", nameEn: "Sodium", mass: 22.99, category: "alkali_metal", period: 3, group: 1, electronConfiguration: "[Ne] 3s¹", description: "Компонент поваренной соли." },
  { atomicNumber: 12, symbol: "Mg", nameRu: "Магний", nameEn: "Magnesium", mass: 24.31, category: "alkaline_earth_metal", period: 3, group: 2, electronConfiguration: "[Ne] 3s²", description: "Горит ярким белым пламенем." },
  { atomicNumber: 13, symbol: "Al", nameRu: "Алюминий", nameEn: "Aluminum", mass: 26.98, category: "post_transition_metal", period: 3, group: 13, electronConfiguration: "[Ne] 3s² 3p¹", description: "Самый распространенный металл в земной коре." },
  { atomicNumber: 14, symbol: "Si", nameRu: "Кремний", nameEn: "Silicon", mass: 28.09, category: "metalloid", period: 3, group: 14, electronConfiguration: "[Ne] 3s² 3p²", description: "Основной материал для электроники." },
  { atomicNumber: 15, symbol: "P", nameRu: "Фосфор", nameEn: "Phosphorus", mass: 30.97, category: "nonmetal", period: 3, group: 15, electronConfiguration: "[Ne] 3s² 3p³", description: "Входит в состав ДНК." },
  { atomicNumber: 16, symbol: "S", nameRu: "Сера", nameEn: "Sulfur", mass: 32.07, category: "nonmetal", period: 3, group: 16, electronConfiguration: "[Ne] 3s² 3p⁴", description: "Желтое вещество с резким запахом." },
  { atomicNumber: 17, symbol: "Cl", nameRu: "Хлор", nameEn: "Chlorine", mass: 35.45, category: "halogen", period: 3, group: 17, electronConfiguration: "[Ne] 3s² 3p⁵", description: "Используется для дезинфекции." },
  { atomicNumber: 18, symbol: "Ar", nameRu: "Аргон", nameEn: "Argon", mass: 39.95, category: "noble_gas", period: 3, group: 18, electronConfiguration: "[Ne] 3s² 3p⁶", description: "Третий по распространенности газ в атмосфере." },
  { atomicNumber: 19, symbol: "K", nameRu: "Калий", nameEn: "Potassium", mass: 39.10, category: "alkali_metal", period: 4, group: 1, electronConfiguration: "[Ar] 4s¹", description: "Важен для нервной системы." },
  { atomicNumber: 20, symbol: "Ca", nameRu: "Кальций", nameEn: "Calcium", mass: 40.08, category: "alkaline_earth_metal", period: 4, group: 2, electronConfiguration: "[Ar] 4s²", description: "Основной компонент костей." },
  { atomicNumber: 21, symbol: "Sc", nameRu: "Скандий", nameEn: "Scandium", mass: 44.96, category: "transition_metal", period: 4, group: 3, electronConfiguration: "[Ar] 3d¹ 4s²", description: "Используется в aerospace." },
  { atomicNumber: 22, symbol: "Ti", nameRu: "Титан", nameEn: "Titanium", mass: 47.87, category: "transition_metal", period: 4, group: 4, electronConfiguration: "[Ar] 3d² 4s²", description: "Прочный и легкий металл." },
  { atomicNumber: 23, symbol: "V", nameRu: "Ванадий", nameEn: "Vanadium", mass: 50.94, category: "transition_metal", period: 4, group: 5, electronConfiguration: "[Ar] 3d³ 4s²", description: "Используется в стали." },
  { atomicNumber: 24, symbol: "Cr", nameRu: "Хром", nameEn: "Chromium", mass: 52.00, category: "transition_metal", period: 4, group: 6, electronConfiguration: "[Ar] 3d⁵ 4s¹", description: "Используется для хромирования." },
  { atomicNumber: 25, symbol: "Mn", nameRu: "Марганец", nameEn: "Manganese", mass: 54.94, category: "transition_metal", period: 4, group: 7, electronConfiguration: "[Ar] 3d⁵ 4s²", description: "Важен для производства стали." },
  { atomicNumber: 26, symbol: "Fe", nameRu: "Железо", nameEn: "Iron", mass: 55.85, category: "transition_metal", period: 4, group: 8, electronConfiguration: "[Ar] 3d⁶ 4s²", description: "Самый распространенный металл на Земле." },
  { atomicNumber: 27, symbol: "Co", nameRu: "Кобальт", nameEn: "Cobalt", mass: 58.93, category: "transition_metal", period: 4, group: 9, electronConfiguration: "[Ar] 3d⁷ 4s²", description: "Используется в магнитах." },
  { atomicNumber: 28, symbol: "Ni", nameRu: "Никель", nameEn: "Nickel", mass: 58.69, category: "transition_metal", period: 4, group: 10, electronConfiguration: "[Ar] 3d⁸ 4s²", description: "Используется в нержавеющей стали." },
  { atomicNumber: 29, symbol: "Cu", nameRu: "Медь", nameEn: "Copper", mass: 63.55, category: "transition_metal", period: 4, group: 11, electronConfiguration: "[Ar] 3d¹⁰ 4s¹", description: "Отличный проводник электричества." },
  { atomicNumber: 30, symbol: "Zn", nameRu: "Цинк", nameEn: "Zinc", mass: 65.38, category: "transition_metal", period: 4, group: 12, electronConfiguration: "[Ar] 3d¹⁰ 4s²", description: "Используется для гальванизации." },
  { atomicNumber: 31, symbol: "Ga", nameRu: "Галлий", nameEn: "Gallium", mass: 69.72, category: "post_transition_metal", period: 4, group: 13, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p¹", description: "Плавится в руках." },
  { atomicNumber: 32, symbol: "Ge", nameRu: "Германий", nameEn: "Germanium", mass: 72.63, category: "metalloid", period: 4, group: 14, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p²", description: "Полупроводник." },
  { atomicNumber: 33, symbol: "As", nameRu: "Мышьяк", nameEn: "Arsenic", mass: 74.92, category: "metalloid", period: 4, group: 15, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p³", description: "Токсичный элемент." },
  { atomicNumber: 34, symbol: "Se", nameRu: "Селен", nameEn: "Selenium", mass: 78.97, category: "nonmetal", period: 4, group: 16, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p⁴", description: "Важен для ферментов." },
  { atomicNumber: 35, symbol: "Br", nameRu: "Бром", nameEn: "Bromine", mass: 79.90, category: "halogen", period: 4, group: 17, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p⁵", description: "Единственный жидкий неметалл." },
  { atomicNumber: 36, symbol: "Kr", nameRu: "Криптон", nameEn: "Krypton", mass: 83.80, category: "noble_gas", period: 4, group: 18, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p⁶", description: "Используется в лампах." },
  { atomicNumber: 37, symbol: "Rb", nameRu: "Рубидий", nameEn: "Rubidium", mass: 85.47, category: "alkali_metal", period: 5, group: 1, electronConfiguration: "[Kr] 5s¹", description: "Мягкий серебристый металл." },
  { atomicNumber: 38, symbol: "Sr", nameRu: "Стронций", nameEn: "Strontium", mass: 87.62, category: "alkaline_earth_metal", period: 5, group: 2, electronConfiguration: "[Kr] 5s²", description: "Красный цвет фейерверков." },
  { atomicNumber: 39, symbol: "Y", nameRu: "Иттрий", nameEn: "Yttrium", mass: 88.91, category: "transition_metal", period: 5, group: 3, electronConfiguration: "[Kr] 4d¹ 5s²", description: "Используется в светодиодах." },
  { atomicNumber: 40, symbol: "Zr", nameRu: "Цирконий", nameEn: "Zirconium", mass: 91.22, category: "transition_metal", period: 5, group: 4, electronConfiguration: "[Kr] 4d² 5s²", description: "Устойчив к коррозии." },
  { atomicNumber: 41, symbol: "Nb", nameRu: "Ниобий", nameEn: "Niobium", mass: 92.91, category: "transition_metal", period: 5, group: 5, electronConfiguration: "[Kr] 4d⁴ 5s¹", description: "Используется в сверхпроводниках." },
  { atomicNumber: 42, symbol: "Mo", nameRu: "Молибден", nameEn: "Molybdenum", mass: 95.95, category: "transition_metal", period: 5, group: 6, electronConfiguration: "[Kr] 4d⁵ 5s¹", description: "Важен для ферментов." },
  { atomicNumber: 43, symbol: "Tc", nameRu: "Технеций", nameEn: "Technetium", mass: 98, category: "transition_metal", period: 5, group: 7, electronConfiguration: "[Kr] 4d⁵ 5s²", description: "Первый искусственный элемент." },
  { atomicNumber: 44, symbol: "Ru", nameRu: "Рутений", nameEn: "Ruthenium", mass: 101.07, category: "transition_metal", period: 5, group: 8, electronConfiguration: "[Kr] 4d⁷ 5s¹", description: "Используется в катализаторах." },
  { atomicNumber: 45, symbol: "Rh", nameRu: "Родий", nameEn: "Rhodium", mass: 102.91, category: "transition_metal", period: 5, group: 9, electronConfiguration: "[Kr] 4d⁸ 5s¹", description: "Самый дорогой металл." },
  { atomicNumber: 46, symbol: "Pd", nameRu: "Палладий", nameEn: "Palladium", mass: 106.42, category: "transition_metal", period: 5, group: 10, electronConfiguration: "[Kr] 4d¹⁰", description: "Катализаторы автомобилей." },
  { atomicNumber: 47, symbol: "Ag", nameRu: "Серебро", nameEn: "Silver", mass: 107.87, category: "transition_metal", period: 5, group: 11, electronConfiguration: "[Kr] 4d¹⁰ 5s¹", description: "Лучший проводник." },
  { atomicNumber: 48, symbol: "Cd", nameRu: "Кадмий", nameEn: "Cadmium", mass: 112.41, category: "transition_metal", period: 5, group: 12, electronConfiguration: "[Kr] 4d¹⁰ 5s²", description: "Токсичный металл." },
  { atomicNumber: 49, symbol: "In", nameRu: "Индий", nameEn: "Indium", mass: 114.82, category: "post_transition_metal", period: 5, group: 13, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p¹", description: "Сенсорные экраны." },
  { atomicNumber: 50, symbol: "Sn", nameRu: "Олово", nameEn: "Tin", mass: 118.71, category: "post_transition_metal", period: 5, group: 14, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p²", description: "Покрытие банок." },
  { atomicNumber: 51, symbol: "Sb", nameRu: "Сурьма", nameEn: "Antimony", mass: 121.76, category: "metalloid", period: 5, group: 15, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p³", description: "Используется в сплавах." },
  { atomicNumber: 52, symbol: "Te", nameRu: "Теллур", nameEn: "Tellurium", mass: 127.60, category: "metalloid", period: 5, group: 16, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p⁴", description: "Солнечные панели." },
  { atomicNumber: 53, symbol: "I", nameRu: "Йод", nameEn: "Iodine", mass: 126.90, category: "halogen", period: 5, group: 17, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p⁵", description: "Важен для щитовидной железы." },
  { atomicNumber: 54, symbol: "Xe", nameRu: "Ксенон", nameEn: "Xenon", mass: 131.29, category: "noble_gas", period: 5, group: 18, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p⁶", description: "Ксеноновые фары." },
  { atomicNumber: 55, symbol: "Cs", nameRu: "Цезий", nameEn: "Cesium", mass: 132.91, category: "alkali_metal", period: 6, group: 1, electronConfiguration: "[Xe] 6s¹", description: "Атомные часы." },
  { atomicNumber: 56, symbol: "Ba", nameRu: "Барий", nameEn: "Barium", mass: 137.33, category: "alkaline_earth_metal", period: 6, group: 2, electronConfiguration: "[Xe] 6s²", description: "Зеленый цвет фейерверков." },
  { atomicNumber: 57, symbol: "La", nameRu: "Лантан", nameEn: "Lanthanum", mass: 138.91, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 5d¹ 6s²", description: "Катализаторы." },
  { atomicNumber: 58, symbol: "Ce", nameRu: "Церий", nameEn: "Cerium", mass: 140.12, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f¹ 5d¹ 6s²", description: "Редкоземельный элемент." },
  { atomicNumber: 59, symbol: "Pr", nameRu: "Празеодим", nameEn: "Praseodymium", mass: 140.91, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f³ 6s²", description: "Зеленое стекло." },
  { atomicNumber: 60, symbol: "Nd", nameRu: "Неодим", nameEn: "Neodymium", mass: 144.24, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f⁴ 6s²", description: "Мощные магниты." },
  { atomicNumber: 61, symbol: "Pm", nameRu: "Прометий", nameEn: "Promethium", mass: 145, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f⁵ 6s²", description: "Радиоактивный." },
  { atomicNumber: 62, symbol: "Sm", nameRu: "Самарий", nameEn: "Samarium", mass: 150.36, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f⁶ 6s²", description: "Магниты." },
  { atomicNumber: 63, symbol: "Eu", nameRu: "Европий", nameEn: "Europium", mass: 151.96, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f⁷ 6s²", description: "Защита банкнот." },
  { atomicNumber: 64, symbol: "Gd", nameRu: "Гадолиний", nameEn: "Gadolinium", mass: 157.25, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f⁷ 5d¹ 6s²", description: "МРТ-сканеры." },
  { atomicNumber: 65, symbol: "Tb", nameRu: "Тербий", nameEn: "Terbium", mass: 158.93, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f⁹ 6s²", description: "Твердотельные устройства." },
  { atomicNumber: 66, symbol: "Dy", nameRu: "Диспрозий", nameEn: "Dysprosium", mass: 162.50, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f¹⁰ 6s²", description: "Магниты и реакторы." },
  { atomicNumber: 67, symbol: "Ho", nameRu: "Гольмий", nameEn: "Holmium", mass: 164.93, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f¹¹ 6s²", description: "Магнитный момент." },
  { atomicNumber: 68, symbol: "Er", nameRu: "Эрбий", nameEn: "Erbium", mass: 167.26, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f¹² 6s²", description: "Розовое стекло." },
  { atomicNumber: 69, symbol: "Tm", nameRu: "Тулий", nameEn: "Thulium", mass: 168.93, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f¹³ 6s²", description: "Лазеры." },
  { atomicNumber: 70, symbol: "Yb", nameRu: "Иттербий", nameEn: "Ytterbium", mass: 173.05, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f¹⁴ 6s²", description: "Атомные часы." },
  { atomicNumber: 71, symbol: "Lu", nameRu: "Лютеций", nameEn: "Lutetium", mass: 174.97, category: "lanthanide", period: 6, group: 3, electronConfiguration: "[Xe] 4f¹⁴ 5d¹ 6s²", description: "Тяжелый редкоземельный." },
  { atomicNumber: 72, symbol: "Hf", nameRu: "Гафний", nameEn: "Hafnium", mass: 178.49, category: "transition_metal", period: 6, group: 4, electronConfiguration: "[Xe] 4f¹⁴ 5d² 6s²", description: "Ядерные реакторы." },
  { atomicNumber: 73, symbol: "Ta", nameRu: "Тантал", nameEn: "Tantalum", mass: 180.95, category: "transition_metal", period: 6, group: 5, electronConfiguration: "[Xe] 4f¹⁴ 5d³ 6s²", description: "Электроника и импланты." },
  { atomicNumber: 74, symbol: "W", nameRu: "Вольфрам", nameEn: "Tungsten", mass: 183.84, category: "transition_metal", period: 6, group: 6, electronConfiguration: "[Xe] 4f¹⁴ 5d⁴ 6s²", description: "Тугоплавкий металл." },
  { atomicNumber: 75, symbol: "Re", nameRu: "Рений", nameEn: "Rhenium", mass: 186.21, category: "transition_metal", period: 6, group: 7, electronConfiguration: "[Xe] 4f¹⁴ 5d⁵ 6s²", description: "Редкий элемент." },
  { atomicNumber: 76, symbol: "Os", nameRu: "Осмий", nameEn: "Osmium", mass: 190.23, category: "transition_metal", period: 6, group: 8, electronConfiguration: "[Xe] 4f¹⁴ 5d⁶ 6s²", description: "Самый плотный элемент." },
  { atomicNumber: 77, symbol: "Ir", nameRu: "Иридий", nameEn: "Iridium", mass: 192.22, category: "transition_metal", period: 6, group: 9, electronConfiguration: "[Xe] 4f¹⁴ 5d⁷ 6s²", description: "Коррозионно-стойкий." },
  { atomicNumber: 78, symbol: "Pt", nameRu: "Платина", nameEn: "Platinum", mass: 195.08, category: "transition_metal", period: 6, group: 10, electronConfiguration: "[Xe] 4f¹⁴ 5d⁹ 6s¹", description: "Драгоценный металл." },
  { atomicNumber: 79, symbol: "Au", nameRu: "Золото", nameEn: "Gold", mass: 196.97, category: "transition_metal", period: 6, group: 11, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", description: "Не окисляется." },
  { atomicNumber: 80, symbol: "Hg", nameRu: "Ртуть", nameEn: "Mercury", mass: 200.59, category: "transition_metal", period: 6, group: 12, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", description: "Жидкий металл." },
  { atomicNumber: 81, symbol: "Tl", nameRu: "Таллий", nameEn: "Thallium", mass: 204.38, category: "post_transition_metal", period: 6, group: 13, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹", description: "Токсичный элемент." },
  { atomicNumber: 82, symbol: "Pb", nameRu: "Свинец", nameEn: "Lead", mass: 207.2, category: "post_transition_metal", period: 6, group: 14, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", description: "Аккумуляторы." },
  { atomicNumber: 83, symbol: "Bi", nameRu: "Висмут", nameEn: "Bismuth", mass: 208.98, category: "post_transition_metal", period: 6, group: 15, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³", description: "Лекарства и сплавы." },
  { atomicNumber: 84, symbol: "Po", nameRu: "Полоний", nameEn: "Polonium", mass: 209, category: "metalloid", period: 6, group: 16, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴", description: "Открыт Мари Кюри." },
  { atomicNumber: 85, symbol: "At", nameRu: "Астат", nameEn: "Astatine", mass: 210, category: "halogen", period: 6, group: 17, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵", description: "Самый редкий элемент." },
  { atomicNumber: 86, symbol: "Rn", nameRu: "Радон", nameEn: "Radon", mass: 222, category: "noble_gas", period: 6, group: 18, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶", description: "Радиоактивный газ." },
  { atomicNumber: 87, symbol: "Fr", nameRu: "Франций", nameEn: "Francium", mass: 223, category: "alkali_metal", period: 7, group: 1, electronConfiguration: "[Rn] 7s¹", description: "Нестабильный элемент." },
  { atomicNumber: 88, symbol: "Ra", nameRu: "Радий", nameEn: "Radium", mass: 226, category: "alkaline_earth_metal", period: 7, group: 2, electronConfiguration: "[Rn] 7s²", description: "Светится в темноте." },
  { atomicNumber: 89, symbol: "Ac", nameRu: "Актиний", nameEn: "Actinium", mass: 227, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 6d¹ 7s²", description: "Радиоактивный металл." },
  { atomicNumber: 90, symbol: "Th", nameRu: "Торий", nameEn: "Thorium", mass: 232.04, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 6d² 7s²", description: "Ядерное топливо." },
  { atomicNumber: 91, symbol: "Pa", nameRu: "Протактиний", nameEn: "Protactinium", mass: 231.04, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f² 6d¹ 7s²", description: "Редкий элемент." },
  { atomicNumber: 92, symbol: "U", nameRu: "Уран", nameEn: "Uranium", mass: 238.03, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f³ 6d¹ 7s²", description: "Ядерные реакторы." },
  { atomicNumber: 93, symbol: "Np", nameRu: "Нептуний", nameEn: "Neptunium", mass: 237, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f⁴ 6d¹ 7s²", description: "Первый трансурановый." },
  { atomicNumber: 94, symbol: "Pu", nameRu: "Плутоний", nameEn: "Plutonium", mass: 244, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f⁶ 7s²", description: "Ядерное оружие." },
  { atomicNumber: 95, symbol: "Am", nameRu: "Америций", nameEn: "Americium", mass: 243, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f⁷ 7s²", description: "Детекторы дыма." },
  { atomicNumber: 96, symbol: "Cm", nameRu: "Кюрий", nameEn: "Curium", mass: 247, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f⁷ 6d¹ 7s²", description: "Назван в честь Кюри." },
  { atomicNumber: 97, symbol: "Bk", nameRu: "Берклий", nameEn: "Berkelium", mass: 247, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f⁹ 7s²", description: "Беркли, Калифорния." },
  { atomicNumber: 98, symbol: "Cf", nameRu: "Калифорний", nameEn: "Californium", mass: 251, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f¹⁰ 7s²", description: "Обнаружение металлов." },
  { atomicNumber: 99, symbol: "Es", nameRu: "Эйнштейний", nameEn: "Einsteinium", mass: 252, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f¹¹ 7s²", description: "Назван в честь Эйнштейна." },
  { atomicNumber: 100, symbol: "Fm", nameRu: "Фермий", nameEn: "Fermium", mass: 257, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f¹² 7s²", description: "Назван в честь Ферми." },
  { atomicNumber: 101, symbol: "Md", nameRu: "Менделеевий", nameEn: "Mendelevium", mass: 258, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f¹³ 7s²", description: "Назван в честь Менделеева." },
  { atomicNumber: 102, symbol: "No", nameRu: "Нобелий", nameEn: "Nobelium", mass: 259, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f¹⁴ 7s²", description: "Назван в честь Нобеля." },
  { atomicNumber: 103, symbol: "Lr", nameRu: "Лоуренсий", nameEn: "Lawrencium", mass: 262, category: "actinide", period: 7, group: 3, electronConfiguration: "[Rn] 5f¹⁴ 7s² 7p¹", description: "Назван в честь Лоуренса." },
  { atomicNumber: 104, symbol: "Rf", nameRu: "Резерфордий", nameEn: "Rutherfordium", mass: 267, category: "transition_metal", period: 7, group: 4, electronConfiguration: "[Rn] 5f¹⁴ 6d² 7s²", description: "Назван в честь Резерфорда." },
  { atomicNumber: 105, symbol: "Db", nameRu: "Дубний", nameEn: "Dubnium", mass: 268, category: "transition_metal", period: 7, group: 5, electronConfiguration: "[Rn] 5f¹⁴ 6d³ 7s²", description: "Назван в честь Дубны." },
  { atomicNumber: 106, symbol: "Sg", nameRu: "Сиборгий", nameEn: "Seaborgium", mass: 269, category: "transition_metal", period: 7, group: 6, electronConfiguration: "[Rn] 5f¹⁴ 6d⁴ 7s²", description: "Назван в честь Сиборга." },
  { atomicNumber: 107, symbol: "Bh", nameRu: "Борий", nameEn: "Bohrium", mass: 270, category: "transition_metal", period: 7, group: 7, electronConfiguration: "[Rn] 5f¹⁴ 6d⁵ 7s²", description: "Назван в честь Бора." },
  { atomicNumber: 108, symbol: "Hs", nameRu: "Хассий", nameEn: "Hassium", mass: 277, category: "transition_metal", period: 7, group: 8, electronConfiguration: "[Rn] 5f¹⁴ 6d⁶ 7s²", description: "Назван в честь Гессена." },
  { atomicNumber: 109, symbol: "Mt", nameRu: "Мейтнерий", nameEn: "Meitnerium", mass: 278, category: "transition_metal", period: 7, group: 9, electronConfiguration: "[Rn] 5f¹⁴ 6d⁷ 7s²", description: "Назван в честь Мейтнер." },
  { atomicNumber: 110, symbol: "Ds", nameRu: "Дармштадтий", nameEn: "Darmstadtium", mass: 281, category: "transition_metal", period: 7, group: 10, electronConfiguration: "[Rn] 5f¹⁴ 6d⁸ 7s²", description: "Назван в честь Дармштадта." },
  { atomicNumber: 111, symbol: "Rg", nameRu: "Рентгений", nameEn: "Roentgenium", mass: 282, category: "transition_metal", period: 7, group: 11, electronConfiguration: "[Rn] 5f¹⁴ 6d⁹ 7s²", description: "Назван в честь Рентгена." },
  { atomicNumber: 112, symbol: "Cn", nameRu: "Коперниций", nameEn: "Copernicium", mass: 285, category: "transition_metal", period: 7, group: 12, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s²", description: "Назван в честь Коперника." },
  { atomicNumber: 113, symbol: "Nh", nameRu: "Нихоний", nameEn: "Nihonium", mass: 286, category: "post_transition_metal", period: 7, group: 13, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹", description: "Назван в честь Японии." },
  { atomicNumber: 114, symbol: "Fl", nameRu: "Флеровий", nameEn: "Flerovium", mass: 289, category: "post_transition_metal", period: 7, group: 14, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²", description: "Назван в честь Флёрова." },
  { atomicNumber: 115, symbol: "Mc", nameRu: "Московий", nameEn: "Moscovium", mass: 290, category: "post_transition_metal", period: 7, group: 15, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³", description: "Назван в честь Москвы." },
  { atomicNumber: 116, symbol: "Lv", nameRu: "Ливерморий", nameEn: "Livermorium", mass: 293, category: "post_transition_metal", period: 7, group: 16, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴", description: "Ливерморская лаборатория." },
  { atomicNumber: 117, symbol: "Ts", nameRu: "Теннессин", nameEn: "Tennessine", mass: 294, category: "halogen", period: 7, group: 17, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵", description: "Назван в честь Теннесси." },
  { atomicNumber: 118, symbol: "Og", nameRu: "Оганесон", nameEn: "Oganesson", mass: 294, category: "noble_gas", period: 7, group: 18, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶", description: "Назван в честь Оганесяна." }
];

// Проверяем, используем ли MongoDB
const useMongoDB = !!process.env.MONGODB_URI;

export async function GET() {
  try {
    if (useMongoDB) {
      // MongoDB (Vercel)
      const { Element } = await getModels();
      let elements = await Element.find({}).sort({ atomicNumber: 1 }).lean();
      
      // Автосидинг если база пуста
      if (elements.length === 0) {
        await Element.insertMany(elementsData);
        console.log('Auto-seeded 118 elements to MongoDB');
        elements = await Element.find({}).sort({ atomicNumber: 1 }).lean();
      }
      
      // Преобразуем _id в id для совместимости
      const result = elements.map((el: any) => ({
        id: el._id.toString(),
        atomicNumber: el.atomicNumber,
        symbol: el.symbol,
        nameRu: el.nameRu,
        nameEn: el.nameEn,
        mass: el.mass,
        category: el.category,
        period: el.period,
        group: el.group,
        electronConfiguration: el.electronConfiguration,
        description: el.description,
      }));
      
      return NextResponse.json(result);
    } else {
      // Prisma/SQLite (локально)
      const count = await db.element.count();
      if (count === 0) {
        await db.element.createMany({ data: elementsData });
        console.log('Auto-seeded 118 elements to SQLite');
      }
      
      const result = await db.element.findMany({ orderBy: { atomicNumber: 'asc' } });
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Error fetching elements:', error);
    return NextResponse.json({ error: 'Failed to fetch elements' }, { status: 500 });
  }
}
