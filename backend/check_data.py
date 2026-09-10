import pandas as pd

files = {
    "recommended": r"C:\TriNetra\data\WorksRecommendedLokSabha.csv",
    "sanctioned": r"C:\TriNetra\data\Works Sanctioned.csv",
    "completed": r"C:\TriNetra\data\WorksCompletedLokSabha.csv",
    "expenditure": r"C:\TriNetra\data\expenditureLokSabha.csv"
}

data = {}

for name, file in files.items():

    print("\n" + "=" * 70)
    print(name.upper())
    print("=" * 70)

    df = pd.read_csv(file, low_memory=False)

    data[name] = df

    print("Rows:", len(df))

    print("Unique WORK:", df["Work" if name != "recommended" else "WORK"].nunique())

    print("Duplicate WORK rows:",
          df["Work" if name != "recommended" else "WORK"].duplicated().sum())

    if "Work ID" in df.columns:
        print("Unique Work ID:", df["Work ID"].nunique())
        print("Missing Work ID:", df["Work ID"].isna().sum())


# --------------------------------------------------
# Compare WORK values between datasets
# --------------------------------------------------

recommended_work = set(data["recommended"]["WORK"].dropna().astype(str))
sanctioned_work = set(data["sanctioned"]["Work"].dropna().astype(str))
completed_work = set(data["completed"]["Work"].dropna().astype(str))
expenditure_work = set(data["expenditure"]["Work"].dropna().astype(str))

print("\n" + "=" * 70)
print("WORK OVERLAP")
print("=" * 70)

print("Recommended ∩ Sanctioned:",
      len(recommended_work & sanctioned_work))

print("Sanctioned ∩ Completed:",
      len(sanctioned_work & completed_work))

print("Sanctioned ∩ Expenditure:",
      len(sanctioned_work & expenditure_work))

print("Completed ∩ Expenditure:",
      len(completed_work & expenditure_work))