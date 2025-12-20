## StockWeb

### Stock Market: Indonesia

### Program Description
StockWeb is an web based application for analyzing stock ownership and IPO stocks with several features including:
- Import and export CSV files containing stock ownership data for the last six months
- Display stacked bar charts and tables of stock ownership
- View and filter IPO stock based on criteria
- Access a list of capital market-related websites

## Related Repositories
- **Frontend**: https://github.com/RichSvK/StockWeb
- **Stock Services**: https://github.com/RichSvK/Stock_Backend
- **IPO Console Application**: https://github.com/RichSvK/GoIPO

### System Requirements
- MySQL 8.3.0
- MySQL Workbench

### Program Preparation
Install all the required software to run the program
- Insert all data to database from the following step in **Program Setup**
- Insert IPO data using IPO console from `https://github.com/RichSvK/GoIPO`
- Clone `https://github.com/RichSvK/Stock_Backend` and run backend service

### Data Source
- Stock Ownership Data
  Source: KSEI (Kustodian Sentral Efek Indonesia)<br>
  URL: https://ksei.co.id/archive_download/holding_composition
- IPO Sample Data
  Source: E-IPO Stock Prospectus<br>
  URL: https://e-ipo.co.id/en

### Program Setup
1. Open MySQL Workbench
2. Open `SQL` folder
3. Create and use database using the commands in `Database.sql`.<br>
   ![image](https://github.com/RichSvK/StockWeb/assets/87809864/ac478249-9e9f-428c-ba0b-c3adb8e090ec)

4. Clone `Back End` repositories `from https://github.com/RichSvK/Stock_Backend`
5. Open terminal or cmd to run the back end by using command `go run .` and click `Allow access`.<br>
   ![image](https://github.com/RichSvK/StockWeb/assets/87809864/98f1f44a-cdba-4d12-81af-1701deedf694)

6. The table will be automatically migrated. <br>
   ![image](https://github.com/RichSvK/StockWeb/assets/87809864/0eaa00cd-b7e9-4002-88c6-fd7f6a89d23e)

7. Run all the insert SQL in `SQL` folder with following step to avoid foreign key error
   - `Insert_Broker.sql`
     ![image](https://github.com/RichSvK/StockWeb/assets/87809864/767a2f03-9600-4a5a-baad-c26579678d10)

   - `Insert_Stock_IPO.sql`
     ![image](https://github.com/RichSvK/StockWeb/assets/87809864/bf42851b-5a96-4cbb-9d61-ddcd4dad7c1b)

   - `Insert_Detail.sql`
     ![image](https://github.com/RichSvK/StockWeb/assets/87809864/f49d8297-8113-4a24-b619-2c913081836e)

   - `Insert_Category.sql`
     ![image](https://github.com/RichSvK/StockWeb/assets/87809864/6f730210-8ec8-4c33-a63c-2015e1eed27d)

   - `Insert_Link.sql`
     ![image](https://github.com/RichSvK/StockWeb/assets/87809864/f00fd820-84ff-4da3-87b4-c8aa42072ff8)

   - `Insert_Stock.sql`
     ![image](https://github.com/RichSvK/StockWeb/assets/87809864/71a68c1c-8f06-4e2a-ae32-b5d7194cbdd4)

9. Run the front end using `Live Server` extensions in Visual Studio Code. <br>
   ![image](https://github.com/RichSvK/StockWeb/assets/87809864/cd6f4ca0-d782-4300-ae08-e572fe1fb8a7)

### Pages
1. Home Page<br>
   The `home` page contains an introduction and services provided. <br>
   ![image](https://github.com/RichSvK/StockWeb/assets/87809864/6860c4d2-f7d4-4409-ba87-31d50a3593ca)

2. Link Page<br>
   The `link` page displays a list of websites related to capital markets and filters based on category ID. <br>
   ![image](https://github.com/RichSvK/StockWeb/assets/87809864/9bdf614f-463c-40be-a9f1-7b3c44979a85)

3. IPO Page<br>
   The `IPO` page displays table of IPO sample data with `Underwriter` and `Value` filter.
   ![image](https://github.com/RichSvK/StockWeb/assets/87809864/ff9daf5d-0c2a-4a00-8820-d5f728b9a5b0)
   ![image](https://github.com/RichSvK/StockWeb/assets/87809864/07d11e8d-1e40-4308-9a4f-6d8a6f646bae)
   ![image](https://github.com/RichSvK/StockWeb/assets/87809864/e9d15227-a7dc-4c96-ae72-debe7602cc16)

5. Balance Page<br>
   The `balance` page displays stock ownership data in table and chart format. User can insert data to database by uploading the correct txt data from KSEI (Kustodian Sentral Efek Indonesia).<br>
   **Notes: User must have internet connection to show the chart because the chart is generated using chart.js from the internet**
   - The inserted data when using `Insert_Stock.sql` only insert 3 months of data so the table and chart only shows 3 months data.
     ![image](https://github.com/RichSvK/StockWeb/assets/87809864/b991af2c-dd5a-4a81-8dbf-45ab795bac7d)

   - Check data from `KSEI data` folder or download it from `https://ksei.co.id/archive_download/holding_composition`
     ![image](https://github.com/RichSvK/StockWeb/assets/87809864/2f1c0f44-1377-4161-aed5-5bbc27e19987)

   - Click `Choose File` button then choose `2024_01_January.txt` from `KSEI data` folder then click `Upload File` button.
     ![image](https://github.com/RichSvK/StockWeb/assets/87809864/485b12aa-d831-4bb6-927e-b1cb6a644ca3)

   - Upload `2023_11_November.txt` and `2023_12_December.txt` too.
   - Check ANTM stock and see the `Change 1 Month` row
     * If there are no changes, the background will be yellow.
     * If the shares are increasing compared to last month, the background will be green.
     * If the shares are decreasing compared to last month, the background will be red.
       ![image](https://github.com/RichSvK/StockWeb/assets/87809864/23f17f09-7ee0-4e8f-9978-efbc38da6af3)
       
   - User can export data to CSV by clicking `Export Data` button and open it in Excel.
     ![image](https://github.com/RichSvK/StockWeb/assets/87809864/894f9183-4ae9-4695-8d18-504da3c4b6ee)
