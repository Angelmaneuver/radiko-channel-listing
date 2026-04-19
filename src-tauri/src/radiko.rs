use ammonia::Builder;
use anyhow::Result;
use chrono::{Local, Timelike};
use quick_xml::de::from_str;
use reqwest::Client;
use serde::{Deserialize, Serialize};

const RADIKO_BASE_PROGRAM_URL: &str = "https://radiko.jp/v3/program/now";

#[derive(Debug, Serialize, Deserialize)]
struct Radiko {
    pub ttl: u32,
    pub srvtime: u64,
    pub stations: Stations,
}

#[derive(Debug, Serialize, Deserialize)]
struct Stations {
    pub station: Vec<Station>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Station {
    #[serde(rename = "@id")]
    pub id: String,
    pub name: String,
    pub progs: Progs,
}

#[derive(Debug, Serialize, Deserialize)]
struct Progs {
    pub date: String,
    pub prog: Vec<Prog>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Prog {
    #[serde(rename = "@id")]
    pub id: String,
    #[serde(rename = "@master_id")]
    pub master_id: String,
    #[serde(rename = "@ft")]
    pub ft: String,
    #[serde(rename = "@to")]
    pub to: String,
    #[serde(rename = "@ftl")]
    pub ftl: String,
    #[serde(rename = "@tol")]
    pub tol: String,
    #[serde(rename = "@dur")]
    pub dur: String,
    pub title: String,
    pub url: Option<String>,
    pub url_link: Option<String>,
    pub failed_record: Option<String>,
    pub ts_in_ng: Option<String>,
    pub tsplus_in_ng: Option<String>,
    pub ts_out_ng: Option<String>,
    pub tsplus_out_ng: Option<String>,
    pub desc: Option<String>,
    pub info: Option<String>,
    pub pfm: Option<String>,
    pub img: Option<String>,
    pub tag: Option<Tags>,
    pub genre: Option<Genres>,
    pub metas: Option<Metas>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Tags {
    #[serde(default)]
    pub item: Vec<TagItem>,
}

#[derive(Debug, Serialize, Deserialize)]
struct TagItem {
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Genres {
    pub personality: Option<Personality>,
    pub program: Option<ProgramGenre>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Personality {
    #[serde(rename = "@id")]
    pub id: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ProgramGenre {
    #[serde(rename = "@id")]
    pub id: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Metas {
    #[serde(default)]
    pub meta: Vec<Meta>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Meta {
    #[serde(rename = "@name")]
    pub name: String,
    #[serde(rename = "@value")]
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ChannelData {
    pub channels: Vec<Channel>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Channel {
    pub id: String,
    pub name: String,
    pub programs: Vec<Program>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Program {
    pub title: String,
    pub time: String,
    pub img: Option<String>,
    pub info: Option<String>,
    pub pfm: Option<String>,
}

impl From<Radiko> for ChannelData {
    fn from(_radiko: Radiko) -> Self {
        let mut channels = ChannelData {
            channels: Vec::new(),
        };

        let now = now();

        for station in _radiko.stations.station {
            let mut channel = Channel {
                id: station.id,
                name: station.name,
                programs: Vec::new(),
            };

            for prog in &station.progs.prog {
                if prog.ftl <= now && now < prog.tol {
                    let info = Builder::new()
                        .tags(std::collections::HashSet::new())
                        .clean(prog.info.clone().as_deref().unwrap_or_default())
                        .to_string();

                    channel.programs.push(Program {
                        title: prog.title.clone(),
                        time: prog.ftl.clone(),
                        img: prog.img.clone(),
                        info: Some(info),
                        pfm: prog.pfm.clone(),
                    });
                }
            }

            if channel.programs.len() == 0 && station.progs.prog.len() > 0 {
                let prog = station
                    .progs
                    .prog
                    .get(station.progs.prog.len() - 1)
                    .unwrap();

                let info = Builder::new()
                    .tags(std::collections::HashSet::new())
                    .clean(prog.info.clone().as_deref().unwrap_or_default())
                    .to_string();

                channel.programs.push(Program {
                    title: prog.title.clone(),
                    time: prog.ftl.clone(),
                    img: prog.img.clone(),
                    info: Some(info),
                    pfm: prog.pfm.clone(),
                });
            }

            channels.channels.push(channel);
        }

        return channels;
    }
}

#[tauri::command]
pub async fn fetch(id: Option<&str>) -> Result<ChannelData, String> {
    let client = Client::new();

    let url = &format!("{}/{}.xml", RADIKO_BASE_PROGRAM_URL, id.unwrap_or("JP13"));

    let response = client
        .get(url)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?;

    let content = response.text().await.map_err(|e| e.to_string())?;

    let radiko: Radiko = from_str(&content).map_err(|e| e.to_string())?;

    Ok(ChannelData::from(radiko))
}

fn now() -> String {
    let datetime = Local::now();
    let hour = if datetime.hour() < 5 {
        24 + datetime.hour()
    } else {
        datetime.hour()
    };

    return format!("{:02}{:02}", hour, datetime.minute());
}

#[cfg(test)]
mod tests {
    #[tokio::test]
    async fn fetch() {
        match super::fetch(None).await {
            Ok(data) => {
                println!();
                println!("チャンネル数={}", data.channels.len());

                for channel in data.channels {
                    println!();

                    println!("チャンネル={} ({})", channel.name, channel.id);

                    for (index, program) in channel.programs.iter().enumerate() {
                        println!("プログラム{}", index + 1);
                        println!("タイトル={}", program.title);
                        println!("時刻={}", program.time);
                        println!("画像={}", program.img.as_deref().unwrap_or_default());
                        println!("情報={}", program.info.as_deref().unwrap_or_default());
                        println!("出演者={}", program.pfm.as_deref().unwrap_or_default());
                    }
                }

                println!();
            }
            Err(e) => eprintln!("{}", e),
        }
    }
}
