package service

import (
	"backend/helper"
	"backend/model/entity"
	"backend/model/web/response"
	"backend/repository"
	"bufio"
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"
)

type BalanceService interface {
	Create(ctx context.Context, fileName string) (int, any)
	ExportCode(ctx context.Context, code string) (int, any)
	GetBalanceData(ctx context.Context, code string) (int, any)
	GetScriptlessChange(ctx context.Context, startTime time.Time, endTime time.Time) (int, any)
}

type BalanceServiceImpl struct {
	BalanceRepository repository.BalanceRepository
}

func NewBalanceService(repositoryBalance repository.BalanceRepository) BalanceService {
	return &BalanceServiceImpl{
		BalanceRepository: repositoryBalance,
	}
}

func (service *BalanceServiceImpl) Create(ctx context.Context, fileName string) (int, any) {
	var path = filepath.Join("Resource", fileName)
	file, err := os.OpenFile(path, os.O_RDONLY, 0444)
	if err != nil {
		return 500, helper.ToFailedResponse(500, err.Error())
	}
	defer file.Close()

	reader := bufio.NewReader(file)

	_, _, err = reader.ReadLine()
	if err != nil {
		return 500, helper.ToFailedResponse(500, err.Error())
	}

	var rowsData []byte = nil
	var listStock []entity.Stock = nil
	var stock = entity.Stock{}
	dateFormatter := "02-Jan-2006"
	for {
		rowsData, _, err = reader.ReadLine()
		if err == io.EOF {
			break
		}

		stockData := strings.Split(string(rowsData), "|")
		if stockData[2] == "CORPORATE BOND" {
			break
		}

		if len(stockData[1]) != 4 {
			continue
		}

		stock.Date, err = time.Parse(dateFormatter, string(stockData[0]))
		if err != nil {
			return 500, helper.ToFailedResponse(500, err.Error())
		}

		stock.Date, err = time.Parse("02-01-2006", stock.Date.Format("02-01-2006"))
		if err != nil {
			return 500, helper.ToFailedResponse(500, err.Error())
		}

		stock.Code = string(stockData[1])

		stock.ListedShares, _ = strconv.ParseUint(string(stockData[3]), 10, 64)
		stock.LocalIS, _ = strconv.ParseUint(string(stockData[5]), 10, 64)
		stock.LocalCP, _ = strconv.ParseUint(string(stockData[6]), 10, 64)
		stock.LocalPF, _ = strconv.ParseUint(string(stockData[7]), 10, 64)
		stock.LocalIB, _ = strconv.ParseUint(string(stockData[8]), 10, 64)
		stock.LocalID, _ = strconv.ParseUint(string(stockData[9]), 10, 64)
		stock.LocalMF, _ = strconv.ParseUint(string(stockData[10]), 10, 64)
		stock.LocalSC, _ = strconv.ParseUint(string(stockData[11]), 10, 64)
		stock.LocalFD, _ = strconv.ParseUint(string(stockData[12]), 10, 64)
		stock.LocalOT, _ = strconv.ParseUint(string(stockData[13]), 10, 64)

		stock.ForeignIS, _ = strconv.ParseUint(string(stockData[15]), 10, 64)
		stock.ForeignCP, _ = strconv.ParseUint(string(stockData[16]), 10, 64)
		stock.ForeignPF, _ = strconv.ParseUint(string(stockData[17]), 10, 64)
		stock.ForeignIB, _ = strconv.ParseUint(string(stockData[18]), 10, 64)
		stock.ForeignID, _ = strconv.ParseUint(string(stockData[19]), 10, 64)
		stock.ForeignMF, _ = strconv.ParseUint(string(stockData[20]), 10, 64)
		stock.ForeignSC, _ = strconv.ParseUint(string(stockData[21]), 10, 64)
		stock.ForeignFD, _ = strconv.ParseUint(string(stockData[22]), 10, 64)
		stock.ForeignOT, _ = strconv.ParseUint(string(stockData[23]), 10, 64)

		listStock = append(listStock, stock)
	}

	err = service.BalanceRepository.Create(ctx, listStock)
	if err != nil {
		fmt.Println(err.Error())
		return 500, helper.ToFailedResponse(500, err.Error())
	}

	return 201, helper.ToWebResponse(201, "Success insert data", nil)
}

func (service *BalanceServiceImpl) ExportCode(ctx context.Context, code string) (int, any) {
	listStock, err := service.BalanceRepository.GetBalanceStock(ctx, code)

	if err != nil {
		return 500, helper.ToFailedResponse(500, err.Error())
	}

	if len(listStock) == 0 {
		return 404, helper.ToFailedResponse(404, fmt.Sprintf("Stock %s Not Found", code))
	}

	err = helper.MakeCSV(code, listStock)
	if err != nil {
		return 500, helper.ToFailedResponse(500, err.Error())
	}

	return 200, helper.ToWebResponse(200, "Success export data", nil)
}

func (service *BalanceServiceImpl) GetBalanceData(ctx context.Context, code string) (int, any) {
	listBalance, err := service.BalanceRepository.GetBalanceStock(ctx, code)
	helper.PanicIfError(err)
	if err != nil {
		return 500, helper.ToFailedResponse(500, err.Error())
	}

	if len(listBalance) == 0 {
		return 404, helper.ToFailedResponse(404, fmt.Sprintf("%s was not found", code))
	}

	return 200, helper.ToWebResponse(200, fmt.Sprintf("%s data found", code), helper.ToBalanceResponses(listBalance))
}

func (service *BalanceServiceImpl) GetScriptlessChange(ctx context.Context, startTime time.Time, endTime time.Time) (int, any) {
	listStock, err := service.BalanceRepository.GetScriptlessChange(ctx, startTime, endTime)
	if err != nil {
		return 500, helper.ToFailedResponse(500, err.Error())
	}

	fmt.Println(startTime)
	var count int = len(listStock)
	if count == 0 {
		return 404, helper.ToFailedResponse(404, "Scriptless data not found")
	}

	var listResponseChange []response.ScriptlessResponse
	var stock response.ScriptlessResponse = response.ScriptlessResponse{}
	for i := 0; i < count; i++ {
		stock = response.ScriptlessResponse{}

		if i < count-1 && listStock[i].Code == listStock[i+1].Code {
			stock.Code = listStock[i].Code
			stock.FirstShare = TotalShares(listStock[i])
			stock.SecondShare = TotalShares(listStock[i+1])
			stock.FirstListedShares = listStock[i].ListedShares
			stock.SecondListedShares = listStock[i+1].ListedShares
			stock.Change = int64(stock.SecondShare) - int64(stock.FirstShare)
			stock.ChangePercentage = float64(stock.Change) / float64(stock.FirstShare) * 100

			if stock.Change != 0 {
				listResponseChange = append(listResponseChange, stock)
			}
			i++
		} else {
			stock.Code = listStock[i].Code
			stock.FirstShare = 0
			stock.FirstListedShares = 0
			stock.SecondShare = TotalShares(listStock[i])
			stock.SecondListedShares = listStock[i].ListedShares
			stock.Change = int64(stock.SecondShare)
			stock.ChangePercentage = 100
			listResponseChange = append(listResponseChange, stock)
		}

	}

	sort.Slice(listResponseChange, func(i, j int) bool {
		return listResponseChange[i].ChangePercentage > listResponseChange[j].ChangePercentage
	})

	return 200, helper.ToWebResponse(200, "Scriptless data change found", listResponseChange)
}

func TotalShares(s entity.Stock) uint64 {
	return s.LocalIS + s.LocalCP + s.LocalPF + s.LocalIB + s.LocalID + s.LocalMF +
		s.LocalSC + s.LocalFD + s.LocalOT + s.ForeignIS + s.ForeignCP + s.ForeignPF +
		s.ForeignIB + s.ForeignID + s.ForeignMF + s.ForeignSC + s.ForeignFD + s.ForeignOT
}
