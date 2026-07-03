import { NavLink } from 'react-router';
import { Home, Search, BookOpen, Bookmark, User, Newspaper } from 'lucide-react';

const tabs = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/feed', icon: Newspaper, label: 'Feed' },
  { to: '/explore', icon: Search, label: 'Explore' },
  { to: '/saved', icon: Bookmark, label: 'Saved' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function AppBottomNav() {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around px-4 py-3 safe-area-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 min-w-[56px] no-underline ${
                  isActive ? '' : ''
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <span
                    className={`text-[10px] ${
                      isActive
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
