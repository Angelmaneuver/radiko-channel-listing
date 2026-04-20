use tauri;

mod devtool;
mod radiko;
mod store;
mod window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let handle = app.handle();

            #[cfg(debug_assertions)]
            {
                devtool::devtool(handle.clone());
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            window::change_minimum,
            window::exit,
            devtool::devtool,
            store::is_minimum,
            radiko::fetch,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
