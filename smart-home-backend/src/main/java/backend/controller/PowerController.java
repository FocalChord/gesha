package backend.controller;

import backend.GetModel;
import backend.GetPVData;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import rs.in.zivanovic.obfuscator.Obfuscated;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@RestController
public class PowerController {

    @GetMapping("/data")
    @CrossOrigin
    public Map<String, String> getData() {
        GetPVData getPVData = new GetPVData("127.0.0.1", 6760);
        HashMap<String, String> map = new HashMap<>();

        try {
            String resp = getPVData.run();
            String resp1 = getPVData.runHouse();
            String resp2 = getPVData.runHeater();
            String resp3 = getPVData.runSensor();

            boolean isConnected = true;

            System.out.println(resp);
            if(Float.parseFloat(resp.substring(33)) > Float.parseFloat(resp1.substring(34))){
                isConnected = false;
            }

            map.put("solarGeneration", resp);
            String obfuscatedResp = new Obfuscated("sha256".toCharArray(), resp).toString();
            map.put("oSolarGeneration", obfuscatedResp.split("=")[1]);

            map.put("houseConsumption", resp1);
            String obfuscatedResp1 = new Obfuscated("sha256".toCharArray(), resp1).toString();
            map.put("oHouseConsumption", obfuscatedResp1.split("=")[1]);

            map.put("heaterConsumption", resp2);
            String obfuscatedResp2 = new Obfuscated("sha256".toCharArray(), resp2).toString();
            map.put("oHeaterConsumption", obfuscatedResp2.split("=")[1]);

            map.put("sensorConsumption", resp3);
            String obfuscatedResp3 = new Obfuscated("sha256".toCharArray(), resp3).toString();
            map.put("oSensorConsumption", obfuscatedResp3.split("=")[1]);

            map.put("gridConn", isConnected ? "true" : "false");
        } catch (IOException e) {
            e.printStackTrace();
        }

        return map;
    }

    @GetMapping("/developer/iec")
    public ModelAndView getIECModel() {
       GetModel getModel = new GetModel("127.0.0.1", 6760);
        String[] modelList = null;
        String model = "Non connection";
        try {
            model = getModel.run();

        } catch (IOException e){
            e.printStackTrace();
        }
       ModelAndView modelAndView = new ModelAndView("display");
       modelAndView.addObject("LD1", model);
//        modelAndView.addObject("LN1", "MMXU");
//        modelAndView.addObject("A1", "TotW: 6\nq: True\nt: 00:59:01");
//        modelAndView.addObject("LD2", "gridInterconnection");
//        modelAndView.addObject("LN2a", "DGEN");
//        modelAndView.addObject("A2a", "mag: 6\nq: True\nt: 00:59:01");
//        modelAndView.addObject("LN2b", "CSWI");
//        modelAndView.addObject("A2b", "cltVal: False\nq: True\nt: 00:59:01");
       return modelAndView;
    }
}
