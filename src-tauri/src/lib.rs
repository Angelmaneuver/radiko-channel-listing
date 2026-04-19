use tauri;

mod devtool;
mod radiko;
mod window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let handle = app.handle();

            #[cfg(debug_assertions)]
            {
                devtool::devtool(handle.clone());
            }
            #[cfg(not(debug_assertions))]
            {
                let window = window::get_main_window(handle.clone());
                window.set_ignore_cursor_events(true).unwrap();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            window::set_click_through,
            window::exit,
            devtool::devtool,
            radiko::fetch
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
