import json
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "AI大赛脱敏数据.xlsx"
OUTPUT = ROOT / "server" / "data" / "jobs.json"


def clean(value):
    if pd.isna(value):
        return ""
    return str(value).replace("\xa0", " ").strip()


def split_keywords(value):
    text = clean(value)
    if not text:
        return []
    parts = []
    for raw in text.replace("，", ",").replace("、", ",").split(","):
        item = raw.strip()
        if item and item not in parts:
            parts.append(item)
    return parts


def main():
    df = pd.read_excel(SOURCE, sheet_name="JD部分")
    df.columns = [clean(col) for col in df.columns]

    jobs = []
    for index, row in df.iterrows():
        jobs.append(
            {
                "id": int(index) + 1,
                "title": clean(row.get("职位名称")),
                "category": clean(row.get("职类名称")),
                "salary": clean(row.get("薪资")),
                "experience": clean(row.get("年限要求")),
                "education": clean(row.get("学历要求")),
                "city": clean(row.get("城市要求")),
                "keywords": split_keywords(row.get("职位关键词")),
                "description": clean(row.get("职位描述")),
                "company": clean(row.get("公司名称")),
                "address": clean(row.get("上班地址")),
                "publishTime": clean(row.get("发布时间")),
            }
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(jobs, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Imported {len(jobs)} jobs to {OUTPUT}")


if __name__ == "__main__":
    main()
