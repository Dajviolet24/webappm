
import React from 'react';
import { getIconComponent } from '../data/mockData';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="bg-movieDark/95 backdrop-blur-sm px-2 py-2 relative">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex space-x-2 py-1 min-w-max">
          {categories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === category.id 
                    ? 'bg-movieBlue text-white shadow-lg shadow-movieBlue/20' 
                    : 'bg-accent/40 text-white/80 hover:bg-accent'
                }`}
              >
                <span className="w-3.5 h-3.5"><IconComponent size={14} /></span>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
