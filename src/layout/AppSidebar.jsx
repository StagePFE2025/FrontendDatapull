import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import {
  PhoneIcon,
  MapIcon,
  UsersIcon,
  MapPinIcon,
  BriefcaseIcon,
  CircleStackIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { useSidebar } from "../context/SidebarContext";

const navItems = [
  {
    icon: <GridIcon />,
    name: "Solutions Overview",
    path: "/home",
    alignRight: true,
  },
  {
    icon: <UserGroupIcon />,
    name: "B2C Solutions",
    subItems: [
      {
        icon: <PhoneIcon />,
        name: "Phonora Advanced Search",
        path: "/personal-search",
        pro: false,
      },
      {
        icon: <MapPinIcon />,
        name: "Phonora Map Search",
        path: "/map-search",
        pro: false,
      },
      {
        icon: <ChartBarIcon />,
        name: "Vizora",
        path: "/statistics",
        pro: false,
      },
    ],
  },
  {
    icon: <BuildingOfficeIcon />,
    name: "B2B Solutions",
    subItems: [
      {
        icon: <EnvelopeIcon />,
        name: "Ghost Mail Hunter",
        path: "/gMail",
        pro: false,
      },
      {
        icon: <MagnifyingGlassIcon />,
        name: "Company Trace",
        path: "/company-trace",
        pro: false,
      },
      {
        icon: <MapIcon />,
        name: "MapSniffer",
        subItems: [
          {
            icon: <MapIcon />,
            name: "Map Search",
            path: "/B2BMap",
            pro: false,
          },
          {
            icon: <MapPinIcon />,
            name: "Advanced Search",
            path: "/B2BSearch",
            pro: false,
          },
        ],
      },
      {
        
        icon: <MagnifyingGlassIcon />,
        name: "ShadowPilot",
        path: "/shadowpilot",
        pro: false,
      },
      
      
    ],
  },//

  
];

const othersItems = [
  
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const [nestedSubMenuHeight, setNestedSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});
  const nestedSubMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    let nestedSubmenuMatched = false;
    
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem, subIndex) => {
            if (subItem.path && isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType,
                index,
              });
              submenuMatched = true;
            } else if (subItem.subItems) {
              subItem.subItems.forEach((nestedSubItem) => {
                if (isActive(nestedSubItem.path)) {
                  setOpenSubmenu({
                    type: menuType,
                    index,
                  });
                  setOpenNestedSubmenu({
                    type: menuType,
                    parentIndex: index,
                    index: subIndex,
                  });
                  submenuMatched = true;
                  nestedSubmenuMatched = true;
                }
              });
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
    if (!nestedSubmenuMatched) {
      setOpenNestedSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu, openNestedSubmenu]);

  useEffect(() => {
    if (openNestedSubmenu !== null) {
      const key = `${openNestedSubmenu.type}-${openNestedSubmenu.parentIndex}-${openNestedSubmenu.index}`;
      if (nestedSubMenuRefs.current[key]) {
        setNestedSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: nestedSubMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openNestedSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    const newSubmenuState = openSubmenu?.type === menuType && openSubmenu?.index === index 
      ? null 
      : { type: menuType, index };
    
    setOpenSubmenu(newSubmenuState);
    
    // Fermer tous les sous-menus imbriqués quand on ferme ou change le menu principal
    if (!newSubmenuState || newSubmenuState.index !== index) {
      setOpenNestedSubmenu(null);
    }
  };

  const handleNestedSubmenuToggle = (parentIndex, index, menuType) => {
    // S'assurer que le menu parent est ouvert
    if (!openSubmenu || openSubmenu.type !== menuType || openSubmenu.index !== parentIndex) {
      setOpenSubmenu({ type: menuType, index: parentIndex });
    }
    
    // Toggle du sous-menu imbriqué
    setOpenNestedSubmenu((prevOpenNestedSubmenu) => {
      if (
        prevOpenNestedSubmenu &&
        prevOpenNestedSubmenu.type === menuType &&
        prevOpenNestedSubmenu.parentIndex === parentIndex &&
        prevOpenNestedSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, parentIndex, index };
    });
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                } ${nav.alignRight ? "justify-start" : ""}`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text ${nav.alignRight ? "text-left flex-1" : ""}`}>
                    {nav.name}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem, subIndex) => (
                  <li key={subItem.name}>
                    {subItem.subItems ? (
                      // Nested submenu item
                      <>
                        <button
                          onClick={() => handleNestedSubmenuToggle(index, subIndex, menuType)}
                          className={`menu-dropdown-item flex items-center w-full ${
                            openNestedSubmenu?.type === menuType &&
                            openNestedSubmenu?.parentIndex === index &&
                            openNestedSubmenu?.index === subIndex
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.icon && (
                            <span className="mr-2 w-5 h-5">{subItem.icon}</span>
                          )}
                          {subItem.name}
                          <ChevronDownIcon
                            className={`ml-auto w-4 h-4 transition-transform duration-200 ${
                              openNestedSubmenu?.type === menuType &&
                              openNestedSubmenu?.parentIndex === index &&
                              openNestedSubmenu?.index === subIndex
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                        <div
                          ref={(el) => {
                            nestedSubMenuRefs.current[`${menuType}-${index}-${subIndex}`] = el;
                          }}
                          className="overflow-hidden transition-all duration-300 ml-6"
                          style={{
                            height:
                              openNestedSubmenu?.type === menuType &&
                              openNestedSubmenu?.parentIndex === index &&
                              openNestedSubmenu?.index === subIndex
                                ? `${nestedSubMenuHeight[`${menuType}-${index}-${subIndex}`]}px`
                                : "0px",
                          }}
                        >
                          <ul className="mt-1 space-y-1">
                            {subItem.subItems.map((nestedSubItem) => (
                              <li key={nestedSubItem.name}>
                                <Link
                                  to={nestedSubItem.path}
                                  className={`menu-dropdown-item flex items-center text-sm ${
                                    isActive(nestedSubItem.path)
                                      ? "menu-dropdown-item-active"
                                      : "menu-dropdown-item-inactive"
                                  }`}
                                >
                                  {nestedSubItem.icon && (
                                    <span className="mr-2 w-4 h-4">{nestedSubItem.icon}</span>
                                  )}
                                  {nestedSubItem.name}
                                  <span className="flex items-center gap-1 ml-auto">
                                    {nestedSubItem.new && (
                                      <span
                                        className={`ml-auto ${
                                          isActive(nestedSubItem.path)
                                            ? "menu-dropdown-badge-active"
                                            : "menu-dropdown-badge-inactive"
                                        } menu-dropdown-badge`}
                                      >
                                        new
                                      </span>
                                    )}
                                    {nestedSubItem.pro && (
                                      <span
                                        className={`ml-auto ${
                                          isActive(nestedSubItem.path)
                                            ? "menu-dropdown-badge-active"
                                            : "menu-dropdown-badge-inactive"
                                        } menu-dropdown-badge`}
                                      >
                                        pro
                                      </span>
                                    )}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      // Regular submenu item
                      <Link
                        to={subItem.path}
                        className={`menu-dropdown-item flex items-center ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.icon && (
                          <span className="mr-2 w-5 h-5">{subItem.icon}</span>
                        )}
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className=" text-center">
          <Typography
            variant="h1"
            className="flex items-center gap-2 transition duration-300 font-semibold text-xxl group"
          >
            <div
              className="text-red-500 mr-2"
              style={{ color: "rgb(244, 84, 92)" }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="8" rx="4" fill="currentColor" />
                <rect y="16" width="40" height="8" rx="4" fill="currentColor" />
                <rect y="32" width="40" height="8" rx="4" fill="currentColor" />
              </svg>
            </div>
            {isExpanded || isHovered || isMobileOpen ? (
              <span className="transition-all duration-300 group-hover:scale-105 ">
                <span
                  className="font-bold group-hover:text-red-500 text-lg "
                  style={{ color: "rgb(244, 84, 92)", fontSize: "2rem" }}
                >
                  Data
                </span>
                <span
                  className="text-gray-700 font-semibold group-hover:text-gray-900 text-lg dark:text-gray-200"
                  style={{ fontSize: "2rem" }}
                >
                  Pull
                </span>

                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 group-hover:bg-red-200">
                  Beta
                </span>
              </span>
            ) : (
              <span></span>
            )}
          </Typography>
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            {<div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;