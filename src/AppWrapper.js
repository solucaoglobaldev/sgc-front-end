import React, { useEffect, useState } from 'react';
import { Route, withRouter, useLocation } from 'react-router-dom';
import App from './App';
import { Login } from './pages/Login';



const AppWrapper = (props) => {
	const [colorScheme, setColorScheme] = useState('dark')
	const [theme, setTheme] = useState('blue');
	const [componentTheme, setComponentTheme] = useState('blue');

	let location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location]);

	const onColorSchemeChange = (scheme) => {
		changeStyleSheetUrl('layout-css', 'layout-' + scheme + '.css', 1);
		changeStyleSheetUrl('theme-css', 'theme-' + scheme + '.css', 1);
		setColorScheme(scheme);
	}

	const changeStyleSheetUrl = (id, value, from) => {
		const element = document.getElementById(id);
		const urlTokens = element.getAttribute('href').split('/');

		if (from === 1) {           // which function invoked this function - change scheme
			urlTokens[urlTokens.length - 1] = value;
		} else if (from === 2) {       // which function invoked this function - change color
			urlTokens[urlTokens.length - 2] = value;
		}

		const newURL = urlTokens.join('/');

		replaceLink(element, newURL);
	}

	const onMenuThemeChange = (theme) => {
		const layoutLink = document.getElementById('layout-css');
		const href = 'assets/layout/css/' + theme + '/layout-' + colorScheme + '.css';

		replaceLink(layoutLink, href);
		setTheme(theme);
	}

	const onComponentThemeChange = (theme) => {
		const themeLink = document.getElementById('theme-css');
		const href = 'assets/theme/' + theme + '/theme-' + colorScheme + '.css';

		replaceLink(themeLink, href);
		setComponentTheme(theme);
	}

	const replaceLink = (linkElement, href, callback) => {
		const id = linkElement.getAttribute('id');
		const cloneLinkElement = linkElement.cloneNode(true);

		cloneLinkElement.setAttribute('href', href);
		cloneLinkElement.setAttribute('id', id + '-clone');

		linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

		cloneLinkElement.addEventListener('load', () => {
			linkElement.remove();
			cloneLinkElement.setAttribute('id', id);

			if (callback) {
				callback();
			}
		});
	}

	switch (props.location.pathname) {
		case '/login':
			return <Route path="/login" render={() => <Login colorScheme={colorScheme} />} />
		default:
			return <App colorScheme={colorScheme} onColorSchemeChange={onColorSchemeChange}
				componentTheme={componentTheme} onComponentThemeChange={onComponentThemeChange}
				theme={theme} onMenuThemeChange={onMenuThemeChange} />;
	}

}

export default withRouter(AppWrapper);