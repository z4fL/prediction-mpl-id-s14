package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Hero struct {
	ID             int      `json:"id"`
	Name           string   `json:"name"`
	Roles          []string `json:"roles"`
	Portrait       string   `json:"portrait"`
	Icon           string   `json:"icon"`
	Durability     int      `json:"durability"`
	Offense        int      `json:"offense"`
	ControlEffects int      `json:"control_effects"`
	Difficulty     int      `json:"difficulty"`
	Early          int      `json:"early"`
	Mid            int      `json:"mid"`
	Late           int      `json:"late"`
}

type HeroJson struct {
	ID       int      `json:"id"`
	Name     string   `json:"name"`
	Roles    []string `json:"roles"`
	Portrait string   `json:"portrait"`
	Icon     string   `json:"icon"`
}

type PositionJson struct {
	Name string `json:"name"`
	Icon string `json:"icon"`
}

type DataPick struct {
	BlueExplaner  []string `json:"blue_explaner"`
	BlueJungler   []string `json:"blue_jungler"`
	BlueMidlaner  []string `json:"blue_midlaner"`
	BlueGoldlaner []string `json:"blue_goldlaner"`
	BlueRoamer    []string `json:"blue_roamer"`
	RedExplaner   []string `json:"red_explaner"`
	RedJungler    []string `json:"red_jungler"`
	RedMidlaner   []string `json:"red_midlaner"`
	RedGoldlaner  []string `json:"red_goldlaner"`
	RedRoamer     []string `json:"red_roamer"`
}

type Attribute struct {
	Hero           []string `json:"hero"`
	Durability     []int    `json:"durability"`
	Offense        []int    `json:"offense"`
	ControlEffects []int    `json:"control_effects"`
	Difficulty     []int    `json:"difficulty"`
	Early          []int    `json:"early"`
	Mid            []int    `json:"mid"`
	Late           []int    `json:"late"`
}

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default()) // Enable CORS

	api := r.Group("/api")
	{
		api.GET("/heroes", getDataHeroes)
		api.GET("/positions", getDataPositions)
		api.Static("/images", "./static")
		api.POST("/data-pick", sendDataPick)
	}

	return r
}

func getDataHeroes(ctx *gin.Context) {
	data, err := os.ReadFile("./data/heroes.json")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load heroes data"})
		return
	}

	var heroes []HeroJson
	if err = json.Unmarshal(data, &heroes); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse JSON"})
		return
	}

	ctx.JSON(http.StatusOK, heroes)
}

func getDataPositions(ctx *gin.Context) {
	data, err := os.ReadFile("./data/positions.json")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load positions data"})
		return
	}

	var positions []PositionJson
	if err = json.Unmarshal(data, &positions); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse JSON"})
		return
	}

	ctx.JSON(http.StatusOK, positions)
}

func sendDataPick(ctx *gin.Context) {
	var dataHero []string

	if err := ctx.ShouldBindJSON(&dataHero); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	data, err := os.ReadFile("./data/heroes.json")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load heroes data"})
		return
	}

	var heroes []Hero
	if err = json.Unmarshal(data, &heroes); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse JSON"})
		return
	}

	pick := DataPick{
		BlueExplaner:  []string{dataHero[0]},
		BlueJungler:   []string{dataHero[1]},
		BlueMidlaner:  []string{dataHero[2]},
		BlueGoldlaner: []string{dataHero[3]},
		BlueRoamer:    []string{dataHero[4]},
		RedExplaner:   []string{dataHero[5]},
		RedJungler:    []string{dataHero[6]},
		RedMidlaner:   []string{dataHero[7]},
		RedGoldlaner:  []string{dataHero[8]},
		RedRoamer:     []string{dataHero[9]},
	}

	var attribute Attribute
	for _, heroName := range dataHero {
		for _, hero := range heroes {
			if hero.Name == heroName {
				attribute.Hero = append(attribute.Hero, heroName)
				attribute.Durability = append(attribute.Durability, hero.Durability)
				attribute.Offense = append(attribute.Offense, hero.Offense)
				attribute.ControlEffects = append(attribute.ControlEffects, hero.ControlEffects)
				attribute.Difficulty = append(attribute.Difficulty, hero.Difficulty)
				attribute.Early = append(attribute.Early, hero.Early)
				attribute.Mid = append(attribute.Mid, hero.Mid)
				attribute.Late = append(attribute.Late, hero.Late)
				break
			}
		}
	}

	dataJson, _ := json.Marshal(gin.H{
		"data_picks": pick, "attributes": attribute,
	})

	requestPost(dataJson, ctx)
}

func requestPost(dataJson []byte, ctx *gin.Context) {
	apiUrl := os.Getenv("FLASK_URL") + "/predict"
	resp, err := http.Post(apiUrl, "application/json", bytes.NewBuffer(dataJson))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal mengirim data ke API"})
		return
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal membaca respons API"})
		return
	}

	// Unmarshal respons JSON ke struct
	var apiResponse map[string]interface{}
	err = json.Unmarshal(body, &apiResponse)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal parsing respons API"})
		return
	}

	// Ambil data "prediction" dari respons
	prediction, ok := apiResponse["prediction"].(string)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Prediction tidak valid"})
		return
	}

	// Kirim kembali respons JSON ke client
	ctx.JSON(http.StatusOK, gin.H{
		"message":    "Data berhasil dikirim ke API eksternal",
		"prediction": prediction,
	})

}

func main() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
	r := SetupRouter()

	r.Run(":8080")
}
