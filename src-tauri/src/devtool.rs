use tauri::AppHandle;

use crate::window;

#[tauri::command]
pub fn devtool(app: AppHandle) {
    #[cfg(debug_assertions)]
    {
        let window = window::get_main_window(app.clone());
        let config = app.config().app.windows.first().unwrap();
        let min: f64;
        let max: f64;

        if window.is_devtools_open() {
            window.close_devtools();
            window::set_window_size(&window, Some(config.width), None);

            min = config.min_width.unwrap();
            max = config.max_width.unwrap();
        } else {
            window.open_devtools();
            window::set_window_size(&window, Some(window::DEBUG_WIDTH), None);

            min = window::DEBUG_WIDTH;
            max = window::DEBUG_WIDTH;
        }

        window::set_available_size(&window, Some(min), Some(max), None, None);

        window.center().unwrap();
    }
}
