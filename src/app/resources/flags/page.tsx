'use client';

import { GradientBackground } from "@/components/ui/gradient-background";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Box, Code, RefreshCw, SquareTerminal } from "lucide-react";
import { useState } from "react";
import { generateResult } from "@/lib/flags/generateResult";
import type { flagsSchema, ExtraFlagType } from "@/lib/flags/generateResult";
import { extraFlags } from "@/lib/flags/flags";
import { serverType } from "@/lib/flags/environment/serverType";

const defaults: flagsSchema = {
  operatingSystem: "linux",
  serverType: "paper",
  gui: true,
  variables: false,
  autoRestart: false,
  extraFlags: [],
  fileName: "server.jar",
  flags: "aikars",
  withResult: true,
  withFlags: false,
  memory: 4,
};

const flagOptions = [
  { name: "None", value: "none" },
  { name: "Aikar's Flags", value: "aikars" },
  { name: "MeowIce's Flags", value: "meowice" },
  { name: "Benchmarked G1GC", value: "benchmarkedG1GC" },
  { name: "Benchmarked ZGC", value: "benchmarkedZGC" },
  { name: "Benchmarked Shenandoah", value: "benchmarkedShenandoah" },
  { name: "Etil's Flags", value: "etils" },
];

const environmentOptions = [
  { name: "Linux", value: "linux" },
  { name: "Windows", value: "windows" },
  { name: "macOS", value: "macos" },
  { name: "Pterodactyl", value: "pterodactyl" },
  { name: "Command", value: "command" },
];

const softwareOptions = [
  { name: "Paper", value: "paper" },
  { name: "Purpur", value: "purpur" },
  { name: "Velocity", value: "velocity" },
  { name: "Waterfall", value: "waterfall" },
];

export default function FlagsPage() {
  const [config, setConfig] = useState<flagsSchema>(defaults);

  const handleInputChange = (field: keyof flagsSchema, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFileNameChange = (value: string) => {
    if (value.replace(/ /g, '') === '') return;
    if (!value.endsWith('.jar')) value += '.jar';
    handleInputChange('fileName', value);
  };

  const handleExtraFlagToggle = (flag: ExtraFlagType) => {
    setConfig(prev => ({
      ...prev,
      extraFlags: prev.extraFlags.includes(flag)
        ? prev.extraFlags.filter(f => f !== flag)
        : [...prev.extraFlags, flag]
    }));
  };

  const generatedScript = generateResult(config).script || '';

  return (
    <div className="relative min-h-screen">
      <GradientBackground />
      <div className="mx-auto max-w-7xl px-6 py-16 pb-32 sm:px-8 sm:py-20 sm:pb-40 lg:px-12">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Flags Generator</h1>
          <p className="mt-4 text-neutral-300 sm:text-lg">
            A simple script generator to start your Minecraft servers with optimal flags
          </p>
        </header>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Server Configuration</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fileName">File Name</Label>
                <Input
                  id="fileName"
                  value={config.fileName}
                  onChange={(e) => handleFileNameChange(e.target.value)}
                  placeholder="server.jar"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select
                    value={config.operatingSystem}
                    onValueChange={(value) => handleInputChange('operatingSystem', value)}
                  >
                    <SelectTrigger id="environment">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      {environmentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="software">Software</Label>
                  <Select
                    value={config.serverType}
                    onValueChange={(value) => handleInputChange('serverType', value)}
                  >
                    <SelectTrigger id="software">
                      <SelectValue placeholder="Select software" />
                    </SelectTrigger>
                    <SelectContent>
                      {softwareOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Memory (GB)</Label>
                <Slider
                  min={0}
                  max={32}
                  step={0.5}
                  value={[config.memory]}
                  onValueChange={([value]) => handleInputChange('memory', value)}
                />
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>0</span>
                  <span>8</span>
                  <span>16</span>
                  <span>24</span>
                  <span>32</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Flags & Options</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="flags">Flags</Label>
                <Select
                  value={config.flags}
                  onValueChange={(value) => handleInputChange('flags', value)}
                >
                  <SelectTrigger id="flags">
                    <SelectValue placeholder="Select flags" />
                  </SelectTrigger>
                  <SelectContent>
                    {flagOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Additional Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gui"
                      checked={config.gui}
                      onCheckedChange={(checked) => handleInputChange('gui', checked)}
                    />
                    <Label htmlFor="gui" className="flex items-center gap-2">
                      <SquareTerminal className="w-4 h-4" /> No GUI
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="variables"
                      checked={config.variables}
                      onCheckedChange={(checked) => handleInputChange('variables', checked)}
                    />
                    <Label htmlFor="variables" className="flex items-center gap-2">
                      <Code className="w-4 h-4" /> Use Variables
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoRestart"
                      checked={config.autoRestart}
                      onCheckedChange={(checked) => handleInputChange('autoRestart', checked)}
                    />
                    <Label htmlFor="autoRestart" className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" /> Auto-restart
                    </Label>
                  </div>
                </div>
              </div>

              {Object.entries(extraFlags)
                .filter(([id]) => 
                  extraFlags[id as ExtraFlagType].supports.includes(config.flags) && 
                  serverType[config.serverType].extraFlags?.includes(id as ExtraFlagType)
                )
                .map(([id, option]) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox
                      id={id}
                      checked={config.extraFlags.includes(id as ExtraFlagType)}
                      onCheckedChange={() => handleExtraFlagToggle(id as ExtraFlagType)}
                    />
                    <Label htmlFor={id} className="flex items-center gap-2">
                      <Box className="w-4 h-4" /> {option.label}
                    </Label>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Generated Script</h2>
            <div className="relative">
              <textarea
                className="w-full h-96 font-mono text-sm bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
                value={generatedScript}
              />
              <Button 
                className="absolute top-4 right-4"
                onClick={() => {
                  navigator.clipboard.writeText(generatedScript);
                }}
              >
                Copy
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
