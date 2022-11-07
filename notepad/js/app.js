$(document).ready(function () {
	const welcomeText = `This is an offline-capable Notepad which is a Progressive Web App.

	The app serves the following features:

	- Write notes which are then saved to the localStorage.
	- Installable on supported browsers for offline usage.
	- "Add To Home Screen" feature on Android-supported devices to launch the app from the home screen.
	- Dark mode.
	- Privacy-focused - We'll never collect your precious data.
	- Light-weight - Loads almost instantly.
	- It's open-source!

	CAUTION: Since the app uses the browser's localStorage to store your notes, 
	it's recommended that you take a backup of your notes more often using the 
	"Download Notes" button or by pressing the "Ctrl/Cmd + S" keys.

	** Start writing your notes **`;

	const darkmodeText = 'Enable dark mode';
	const lightmodeText = 'Enable light mode';
	const darkMetaColor = '#0d1117';
	const lightMetaColor = '#4d4d4d';
	const metaThemeColor = document.querySelector('meta[name=theme-color]');
	const defaultFontSize = 18;
	const defaultLineHeight = 26;
	const defaultFontWeight = 'normal';
	const defaultShowWordCountPill = 'Yes';
	const { notepad, state, setState, removeState, get } = selector();

	const noteItem = state.note && state.note != '' ? state.note : welcomeText;
	const characterAndWordCountText = calculateCharactersAndWords(noteItem);
	notepad.wordCount.text(characterAndWordCountText);
	notepad.note.val(noteItem);

	if (!state.isUserPreferredTheme) {
		setState('isUserPreferredTheme', 'false');
	}

	if (state.userChosenFontSize) {
		notepad.note.css('font-size', state.userChosenFontSize + 'px');
		notepad.fontSize.val(state.userChosenFontSize);
	} else {
		resetFontSize(defaultFontSize);
	}

	if (state.userChosenFontWeight) {
		notepad.note.css('font-weight', state.userChosenFontWeight);
		notepad.fontWeight.val(state.userChosenFontWeight);
	} else {
		resetFontWeight(defaultFontWeight);
	}

	if (state.userChosenLineHeight) {
		notepad.note.css('line-height', state.userChosenLineHeight + 'px');
		notepad.lineHeight.val(state.userChosenLineHeight);
	} else {
		resetLineHeight(defaultLineHeight);
	}

	const userChosenWordCountPillSelected = state.userChosenWordCountPillSelected

	if (userChosenWordCountPillSelected) {
		userChosenWordCountPillSelected === 'Yes' ? notepad.wordCountContainer.show() : notepad.wordCountContainer.hide();
		notepad.showWordCountPill.val(userChosenWordCountPillSelected);
	} else {
		resetShowWordCountPill(defaultShowWordCountPill);
	}

	if (state.mode && state.mode === 'dark') {
		enableDarkMode(lightmodeText, darkMetaColor, metaThemeColor);
	} else {
		enableLightMode(darkmodeText, lightMetaColor, metaThemeColor);
	}

	notepad.note.keyup(debounce(function () {
		const characterAndWordCountText = calculateCharactersAndWords(get(this).val());
		notepad.wordCount.text(characterAndWordCountText);
		setState('note', get(this).val());
	}, 500));
	
	notepad.clearNotes.on('click', function () {
		Swal.fire({
			title: 'Want to delete notes?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Delete'
		}).then((result) => {
			if (result.value) {
				notepad.note.val('').focus();
				setState('note', '');

				Swal.fire(
					'Deleted!',
					'Your notes has been deleted.',
					'success'
				)
			}
		})
	});

	notepad.mode.click(function () {
		get(document.body).toggleClass('dark');
		let bodyClass = get(document.body).attr('class');

		if (bodyClass === 'dark') {
			enableDarkMode(lightmodeText, darkMetaColor, metaThemeColor)
		} else {
			enableLightMode(darkmodeText, lightMetaColor, metaThemeColor)
		}

		setState('isUserPreferredTheme', 'true');
	});

	notepad.copyToClipboard.click(function () {
		navigator.clipboard.writeText(notepad.note.val()).then(function () {
			showToast('Notes copied to clipboard!')
		}, function () {
			showToast('Failure to copy. Check permissions for clipboard.')
		});
	})

	notepad.downloadNotes.click(function () {
		saveTextAsFile(note.value, getFileName());
	})

	setTimeout(function () {
		if (!state.hasUserDismissedDonationPopup) {
			notepad.stickyNotice.toggleClass('make-hidden');
		}
	}, 30000);

	notepad.closeDonationPopup.click(function () {
		notepad.stickyNotice.remove();
		setState('hasUserDismissedDonationPopup', 'true');
	});

	notepad.fontSize.on('change', function (e) {
		const fontSizeSelected = this.value;

		notepad.note.css('font-size', fontSizeSelected + 'px');
		setState('userChosenFontSize', fontSizeSelected);
	});

	notepad.lineHeight.on('change', function (e) {
		const lineHeightSelected = this.value;

		notepad.note.css('line-height', lineHeightSelected + 'px');
		setState('userChosenLineHeight', lineHeightSelected);
	});

	notepad.fontWeight.on('change', function (e) {
		const fontWeightSelected = this.value;

		notepad.note.css('font-weight', fontWeightSelected);
		setState('userChosenFontWeight', fontWeightSelected);
	});

	notepad.showWordCountPill.on('change', function (e) {
		const showWordCountPillSelected = this.value;

		showWordCountPillSelected === 'Yes' ? notepad.wordCountContainer.show() : notepad.wordCountContainer.hide();
		setState('userChosenWordCountPillSelected', showWordCountPillSelected);
	});

	notepad.resetPreferences.click(function () {
		if (selector().state.userChosenFontSize) {	
			removeState('userChosenFontSize');
			resetFontSize(defaultFontSize);
		}
			
		if (selector().state.userChosenLineHeight) {
			removeState('userChosenLineHeight');
			resetLineHeight(defaultLineHeight);
		}

		if (selector().state.userChosenFontWeight) {
			removeState('userChosenFontWeight');
			resetFontWeight(defaultFontWeight);
		}

		if (selector().state.userChosenWordCountPillSelected) {
			removeState('userChosenWordCountPillSelected');
			resetShowWordCountPill(defaultShowWordCountPill);
		}
	});

	// This changes the application's theme when 
	// user toggles device's theme preference
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches: isSystemDarkModeEnabled }) => {
		// To override device's theme preference
		// if user sets theme manually in the app
		if (state.isUserPreferredTheme === 'true') {
			return;
		}

		isSystemDarkModeEnabled
			? enableDarkMode(lightmodeText, darkMetaColor, metaThemeColor)
			: enableLightMode(darkmodeText, lightMetaColor, metaThemeColor)
	});

	// This sets the application's theme based on
	// the device's theme preference when it loads
	if (state.isUserPreferredTheme === 'false') {
		window.matchMedia('(prefers-color-scheme: dark)').matches
			? enableDarkMode(lightmodeText, darkMetaColor, metaThemeColor)
			: enableLightMode(darkmodeText, lightMetaColor, metaThemeColor);
	} 

	if (getPWADisplayMode() === 'standalone') {
		notepad.installApp.hide();
	}

	window.matchMedia('(display-mode: standalone)').addEventListener('change', ({ matches }) => {
		if (matches) {
			notepad.installApp.hide();
		} else {
			notepad.installApp.show();
		}
	});

	document.onkeydown = function (event) {
		event = event || window.event;

		if (event.key === 'Escape') {
			notepad.aboutModal.modal('hide');
			notepad.preferencesModal.modal('hide');
		} else if (event.ctrlKey && event.code === 'KeyS') {
			saveTextAsFile(note.value, getFileName());
			event.preventDefault();
		}
	};
});

// Registering ServiceWorker
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js').then(function (registration) {
		console.log('ServiceWorker registration successful with scope: ', registration.scope);
	}).catch(function (err) {
		console.log('ServiceWorker registration failed: ', err);
	});
}

let deferredPrompt;
let installSource;

window.addEventListener('beforeinstallprompt', (e) => {
	selector().notepad.installAppButtonContainer.show();
	deferredPrompt = e;
	installSource = 'nativeInstallCard';

	e.userChoice.then(function (choiceResult) {
		if (choiceResult.outcome === 'accepted') {
			deferredPrompt = null;
		}

		ga('send', {
			hitType: 'event',
			eventCategory: 'pwa-install',
			eventAction: 'native-installation-card-prompted',
			eventLabel: installSource,
			eventValue: choiceResult.outcome === 'accepted' ? 1 : 0
		});
	});
});

const installApp = document.getElementById('installApp');

installApp.addEventListener('click', async () => {
	installSource = 'customInstallationButton';

	if (deferredPrompt !== null) {
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') {
			deferredPrompt = null;
		}

		ga('send', {
			hitType: 'event',
			eventCategory: 'pwa-install',
			eventAction: 'custom-installation-button-clicked',
			eventLabel: installSource,
			eventValue: outcome === 'accepted' ? 1 : 0
		});
	} else {
		showToast('Notepad is already installed.')
	}
});

window.addEventListener('appinstalled', () => {
	deferredPrompt = null;

	const source = installSource || 'browser';

	ga('send', 'event', 'pwa-install', 'installed', source);
});