import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { Route, useLocation } from 'react-router-dom';

import AppTopbar from './AppTopbar';
import AppFooter from './AppFooter';
import AppConfig from './AppConfig';
import AppRightMenu from './AppRightMenu';
import AppBreadcrumb from './AppBreadcrumb';
import AppMenu from './AppMenu';
import FormLayoutDemo from './components/FormLayoutDemo';
import Departamento from './components/Departamento';
import Grupo from './components/Grupo';
import 'toastr/build/toastr.min.js';



import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.scss';
import 'toastr/build/toastr.css';


const App = (props) => {

    const [rightMenuActive, setRightMenuActive] = useState(false);
    const [configActive, setConfigActive] = useState(false);
    const [menuMode, setMenuMode] = useState('sidebar');
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [ripple, setRipple] = useState(true);
    const [sidebarStatic, setSidebarStatic] = useState(false);
    const [staticMenuDesktopInactive, setStaticMenuDesktopInactive] = useState(false);
    const [staticMenuMobileActive, setStaticMenuMobileActive] = useState(false);
    const [menuActive, setMenuActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [topbarMenuActive, setTopbarMenuActive] = useState(false);
    const [sidebarActive, setSidebarActive] = useState(false);
    const [pinActive, setPinActive] = useState(false);
    const [activeInlineProfile, setActiveInlineProfile] = useState(false);
    const [resetActiveIndex, setResetActiveIndex] = useState(null);
    const copyTooltipRef = useRef();
    const location = useLocation();

    PrimeReact.ripple = true;

    const menu = [
        {
            label: 'Favorites', icon: 'pi pi-home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-home', to: '/' },
            ]
        },
        {
            label: 'Menu Cadastro', icon: 'pi pi-star',
            items: [
                { label: 'Departamento', icon: 'pi pi-id-card', to: '/departamento' },
                { label: 'Grupo', icon: 'pi pi-id-card', to: '/grupo'}
               
            ]
        },
        {
            label: "PrimeBlocks", icon: "pi pi-prime",
            items: [
                
                
            ]
        },
        {
            label: 'Utilities', icon: 'pi pi-compass',
            items: [
              
            ]
        },
        {
            label: 'Pages', icon: 'pi pi-briefcase',
            items: [     
                { label: 'Login', icon: 'pi pi-sign-in', to: '/login' },
            ]
        },
        {
            label: 'Hierarchy', icon: 'pi pi-align-left',
            items: [
                
                
            ]
        },
        {
            label: 'Start', icon: 'pi pi-download',
            items: [
                
            ]
        }
    ];

    const routes = [
        { parent: 'Dashboard', label: 'Sales Dashboard' },
        { parent: 'Menu Cadastro', label: 'Departamento' },  
        { parent: 'Menu Cadastro', label: 'Grupo'},    
        { parent: 'Pages', label: 'Login' } 
      
    ];

    let rightMenuClick;
    let configClick;
    let menuClick;
    let searchClick = false;
    let topbarItemClick;

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    useEffect(() => {
        setResetActiveIndex(true)
        setMenuActive(false)
    }, [menuMode])

    const onDocumentClick = () => {
        if (!searchClick && searchActive) {
            onSearchHide();
        }

        if (!topbarItemClick) {
            setTopbarMenuActive(false)
        }

        if (!menuClick) {
            if (isHorizontal() || isSlim()) {
                setMenuActive(false)
                setResetActiveIndex(true)
            }

            if (overlayMenuActive || staticMenuMobileActive) {
                setOverlayMenuActive(false);
                setStaticMenuMobileActive(false)
            }

            hideOverlayMenu();
            unblockBodyScroll();
        }

        if (!rightMenuClick) {
            setRightMenuActive(false)
        }

        if (configActive && !configClick) {
            setConfigActive(false);
        }

        topbarItemClick = false;
        menuClick = false;
        configClick = false;
        rightMenuClick = false;
        searchClick = false;
    }

    const onSearchHide = () => {
        setSearchActive(false);
        searchClick = false;
    }

    const onMenuModeChange = (menuMode) => {
        setMenuMode(menuMode);
        setOverlayMenuActive(false);
    }

    const onRightMenuButtonClick = () => {
        rightMenuClick = true;
        setRightMenuActive(true)
    }

    const onRightMenuClick = () => {
        rightMenuClick = true;
    }

    const onRightMenuActiveChange = (active) => {
        setRightMenuActive(active);
    }

    const onConfigClick = () => {
        configClick = true;
    }

    const onConfigButtonClick = (event) => {
        setConfigActive(prevState => !prevState)
        configClick = true;
        event.preventDefault();
    }

    const onRippleChange = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    }

    const onMenuButtonClick = (event) => {
        menuClick = true;

        if (isOverlay()) {
            setOverlayMenuActive(prevState => !prevState)
        }

        if (isDesktop()) {
            setStaticMenuDesktopInactive(prevState => !prevState)
        } else {
            setStaticMenuMobileActive(prevState => !prevState)
        }

        event.preventDefault();
    }

    const hideOverlayMenu = () => {
        setOverlayMenuActive(false)
        setStaticMenuMobileActive(false)
    }

    const onTopbarItemClick = (event) => {
        topbarItemClick = true;
        setTopbarMenuActive(prevState => !prevState)
        hideOverlayMenu();
        event.preventDefault();
    }

    const onToggleMenu = (event) => {
        menuClick = true;

        if (overlayMenuActive) {
            setOverlayMenuActive(false)
        }

        if (sidebarActive) {
            setSidebarStatic(prevState => !prevState)
        }

        event.preventDefault();
    }

    const onSidebarMouseOver = () => {
        if (menuMode === 'sidebar' && !sidebarStatic) {
            setSidebarActive(isDesktop());
            setTimeout(() => {
                setPinActive(isDesktop())
            }, 200);
        }
    }

    const onSidebarMouseLeave = () => {
        if (menuMode === 'sidebar' && !sidebarStatic) {
            setTimeout(() => {
                setSidebarActive(false);
                setPinActive(false);
            }, 250);
        }
    }

    const onMenuClick = () => {
        menuClick = true;
    }

    const onChangeActiveInlineMenu = (event) => {
        setActiveInlineProfile(prevState => !prevState);
        event.preventDefault();
    }

    const onRootMenuItemClick = () => {
        setMenuActive(prevState => !prevState)
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            hideOverlayMenu();
            setResetActiveIndex(true);
        }

        if (!event.item.items && (isHorizontal() || isSlim())) {
            setMenuActive(false);
        }
    }

    const isHorizontal = () => {
        return menuMode === 'horizontal';
    }

    const isSlim = () => {
        return menuMode === 'slim';
    }

    const isOverlay = () => {
        return menuMode === 'overlay';
    }

    const isDesktop = () => {
        return window.innerWidth > 991;
    }


    const onInputClick = () => {
        searchClick = true
    }

    const breadcrumbClick = () => {
        searchClick = true;
        setSearchActive(true);
    }

    const unblockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    const layoutClassName = classNames('layout-wrapper', {
        'layout-static': menuMode === 'static',
        'layout-overlay': menuMode === 'overlay',
        'layout-overlay-active': overlayMenuActive,
        'layout-slim': menuMode === 'slim',
        'layout-horizontal': menuMode === 'horizontal',
        'layout-active': menuActive,
        'layout-mobile-active': staticMenuMobileActive,
        'layout-sidebar': menuMode === 'sidebar',
        'layout-sidebar-static': menuMode === 'sidebar' && sidebarStatic,
        'layout-static-inactive': staticMenuDesktopInactive && menuMode === 'static',
        'p-ripple-disabled': !ripple
    });

    return (
        <div className={layoutClassName} onClick={onDocumentClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <div className="layout-main">
                <AppTopbar items={menu} menuMode={menuMode} colorScheme={props.colorScheme} menuActive={menuActive}
                    topbarMenuActive={topbarMenuActive} activeInlineProfile={activeInlineProfile} onTopbarItemClick={onTopbarItemClick} onMenuButtonClick={onMenuButtonClick}
                    onSidebarMouseOver={onSidebarMouseOver} onSidebarMouseLeave={onSidebarMouseLeave} onToggleMenu={onToggleMenu}
                    onChangeActiveInlineMenu={onChangeActiveInlineMenu} onMenuClick={onMenuClick} onMenuItemClick={onMenuItemClick}
                    onRootMenuItemClick={onRootMenuItemClick} resetActiveIndex={resetActiveIndex} />

                <AppMenu model={menu} onRootMenuItemClick={onRootMenuItemClick} onMenuItemClick={onMenuItemClick} onToggleMenu={onToggleMenu} onMenuClick={onMenuClick} menuMode={menuMode}
                    colorScheme={props.colorScheme} menuActive={menuActive}
                    sidebarActive={sidebarActive} sidebarStatic={sidebarStatic} pinActive={pinActive}
                    onSidebarMouseLeave={onSidebarMouseLeave} onSidebarMouseOver={onSidebarMouseOver}
                    activeInlineProfile={activeInlineProfile} onChangeActiveInlineMenu={onChangeActiveInlineMenu} resetActiveIndex={resetActiveIndex} />

                <AppBreadcrumb routes={routes} onMenuButtonClick={onMenuButtonClick} menuMode={menuMode}
                    onRightMenuButtonClick={onRightMenuButtonClick} onInputClick={onInputClick}
                    searchActive={searchActive} breadcrumbClick={breadcrumbClick} />

                <div className="layout-main-content">
                    <Route path="/formlayout" component={FormLayoutDemo} />
                    <Route path="/departamento" component={Departamento} />
                    <Route path="/grupo" component={Grupo} />
                </div>

                <AppFooter colorScheme={props.colorScheme} />

            </div>

            <AppRightMenu rightMenuActive={rightMenuActive} onRightMenuClick={onRightMenuClick} onRightMenuActiveChange={onRightMenuActiveChange} />

            <AppConfig configActive={configActive} onConfigButtonClick={onConfigButtonClick} onConfigClick={onConfigClick} menuMode={menuMode} changeMenuMode={onMenuModeChange}
                colorScheme={props.colorScheme} changeColorScheme={props.onColorSchemeChange} theme={props.theme} changeTheme={props.onMenuThemeChange}
                componentTheme={props.componentTheme} changeComponentTheme={props.onComponentThemeChange}
                ripple={ripple} onRippleChange={onRippleChange} />

        </div>
    );

}

export default App;
