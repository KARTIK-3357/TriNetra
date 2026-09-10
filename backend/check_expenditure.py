import pandas as pd

file = r"C:\TriNetra\data\expenditureLokSabha.csv"

df = pd.read_csv(file, low_memory=False)

print("\nCOLUMNS:")
print(df.columns.tolist())

print("\nFIRST 20 WORK IDs:")
print(df[["Work ID", "Work", "IDA"]].head(20).to_string(index=False))

print("\nWORK ID DUPLICATES:")
print("Total:", len(df))
print("Unique:", df["Work ID"].nunique())
print("Duplicates:", df["Work ID"].duplicated().sum())

print("\nSAMPLE WORK ID COUNTS:")
print(df["Work ID"].value_counts().head(20))